'use strict';

//polyfills
const process = require('suman-browser-polyfills/modules/process');
const global = require('suman-browser-polyfills/modules/global');

//core
const util = require('util');

//npm
const _ = require('lodash');
const fnArgs = require('function-arguments');
const su = require('suman-utils');

//project
const _suman = global.__suman = (global.__suman || {});
const makeGen = require('./helpers/async-gen');

////////////////////////////////////////////////////////////////////

// This module is used to require once-pre-integrants when running test in separate proc
// Since no integrants have already been cached (since we are single proc), we can simplify.
// Although we should just use the cache code instead

///////////////////////////////////////////////////////////////////

let count = 0;
const cachedPromises = {};

////////////////////////////////////////////////////////////////////

module.exports = function acquireDependencies(depList, depContainerObj, cb) {

  if (++count > 1) {
    throw new Error('=> Suman implementation error => should be called no more than once.');
  }

  const getAllPromises = function (key, $val) {

    let c;
    if (c = cachedPromises[key]) {
      return c;
    }

    const val = depContainerObj[key];
    let subDeps;
    let fn;

    if (Array.isArray(val)) {
      fn = val[val.length - 1];
      val.pop();
      subDeps = val;
    }
    else {
      subDeps = [];
      fn = val;
    }

    const acc = {}; // accumulated value

    return cachedPromises[key] = subDeps.reduce(function (p, k) {

      return p.then(val => getAllPromises(k, val)).then(function (v) {
        acc[k] = v;
        return acc;
      });

    }, Promise.resolve(undefined)).then(function (vals) {

      return new Promise(function (resolve, reject) {

        if (_suman.sumanOpts.verbose || su.isSumanDebug()) {
          console.log(' => Executing dep with key = "' + key + '"');
        }

        setTimeout(function () {
          reject(new Error('Suman dependency acquisition timed-out for dependency with key/id="' + key + '"'));
        }, _suman.weAreDebugging ? 5000000 : 500000);

        if (typeof fn !== 'function') {
          reject({
            key: key,
            error: new Error(' => Suman usage error => would-be function was undefined or otherwise ' +
              'not a function => ' + String(fn))
          });
        }
        else if (fn.length > 1 && su.isGeneratorFn(fn)) {
          reject(new Error(' => Suman usage error => function was a generator function but also took a callback' + String(fn)));
        }
        else if (su.isGeneratorFn(fn)) {
          const gen = makeGen(fn, null);
          gen.call(undefined, vals).then(resolve, function (e) {
            reject({
              key: key,
              error: e
            });
          });
        }
        else if (fn.length > 1) {
          let args = fnArgs(fn);
          let str = fn.toString();
          let matches = str.match(new RegExp(args[1], 'g')) || [];
          if (matches.length < 2) {
            //there should be at least two instances of the 'cb' string in the function,
            // one in the parameters array, the other in the fn body.
            return reject({
              key: key,
              error: new Error(' => Suman usage error => Callback in your function was not present => ' + str)
            });
          }
          fn.call(undefined, vals, function (e, val) { //TODO what to use for ctx of this .apply call?
            e ? reject({
              key: key,
              error: e
            }) : resolve(val);
          });
        }
        else {
          Promise.resolve(fn.call(undefined, vals)).then(resolve, function (e) {
            reject({
              key: key,
              error: e
            });
          });
        }
      });
    });
  };

  const promises = depList.map(function (key) {
    return getAllPromises(key);
  });

  Promise.all(_.flattenDeep(promises)).then(function (deps) {

    Object.keys(depContainerObj).forEach(function (key, index) {
      depContainerObj[key] = deps[index];
      su.runAssertionToCheckForSerialization(depContainerObj[key]);
    });

    cb(null, depContainerObj);

  }, function (err) {

    err = new Error(' => Suman fatal error => Suman had a problem verifying your integrants in ' +
      'your suman.once.js file. => \n' + util.inspect(err.stack || err));
    cb(err, {});

  });
};
