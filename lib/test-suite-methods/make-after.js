'use strict';

//core
const domain = require('domain');
const util = require('util');

//npm
const pragmatik = require('pragmatik');
const _ = require('underscore');
const async = require('async');
const colors = require('colors/safe');

//project

const rules = require('../helpers/handle-varargs');
const constants = require('../../config/suman-constants');
const handleSetupComplete = require('../handle-setup-complete');


function handleBadOptionsForAllHook(hook, opts) {

  if (opts.plan !== undefined && !Number.isInteger(opts.plan)) {
    console.error(' => Suman usage error => "plan" option is not an integer.');
    return process.exit(constants.EXIT_CODES.OPTS_PLAN_NOT_AN_INTEGER);
  }
}

//////////////////////////////////////////////////////////////////

module.exports = function(suman, zuite){

  return function (desc, opts, fn) {

    handleSetupComplete(zuite);

    const args = pragmatik.parse(arguments, rules.hookSignature, {
      preParsed: typeof opts === 'object' ? opts.__preParsed : null
    });

    // cannot use object/array destructuring because Node v4 does not support
    const obj = {
      desc: args[0],
      opts: args[1],
      fn: args[2]
    };

    handleBadOptionsForAllHook(obj.opts, zuite);

    if (obj.opts.skip) {
      suman.numHooksSkipped++;
    }
    else if (!obj.fn) {
      suman.numHooksStubbed++;
    }
    else {
      zuite.getAfters().push({   //TODO: add timeout option
        ctx: zuite,
        timeout: obj.opts.timeout || 11000,
        desc: obj.desc || (obj.fn ? obj.fn.name : '(unknown due to stubbed function)'),
        cb: obj.opts.cb || false,
        throws: obj.opts.throws,
        planCountExpected: obj.opts.plan,
        fatal: !(obj.opts.fatal === false),
        fn: obj.fn,
        type: 'after/teardown',
        warningErr: new Error('SUMAN_TEMP_WARNING_ERROR')
      });
    }

    return zuite;

  };


};