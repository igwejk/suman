'use strict';

//core
const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const url = require('url');
const os = require('os');
const util = require('util');

//npm
const async = require('async');
const request = require('request');
const _ = require('underscore');

//project
const _suman = global.__suman = (global.__suman || {});
const su = require('suman-utils');

//TODO: http://stackoverflow.com/questions/19275776/node-js-how-to-get-the-os-platforms-user-data-folder

///////////////////////////////////////////////////////////////

function reconcilePath (appRoot, fullPath) {

  let split1 = path.normalize(String(appRoot)).split(path.sep);
  let split2 = path.normalize(String(fullPath)).split(path.sep);

  let newArray = [];

  split2.forEach(function (token, index) {

    let otherToken = null;
    try {
      otherToken = split1[ index ];
      if (token !== otherToken) {
        newArray.push(token);
      }
    }
    catch (err) {
      newArray.push(token);
    }

  });

  let sep = String(path.sep); //need to assign path.sep to temporary local variable so we don't overwrite value for path.sep below
  return sep += newArray.join(path.sep);
}

module.exports = function makeComplete (cb) {

  const config = _suman.sumanConfig;
  const timestamp = _suman.timestamp;
  const usingLiveSumanServer = _suman.usingLiveSumanServer;
  const server = _suman.server;

  let host = null;
  let port = null;

  //TODO is server.outputDir is not defined... then we won't write results temp.html out?!?

  if (usingLiveSumanServer && server) {

    host = server.host;
    port = server.port;

    doBrowserThing(server.outputDir);

  }
  else if (server) {

    host = server.host;
    port = server.port;
    doBrowserThing(server.outputDir);

  }
  else {
    console.error('\n\n => Suman warning: no server defined..using default dir to store data.\n');
    doBrowserThing(path.resolve(su.getHomeDir() + '/suman_results'));

  }

  function doBrowserThing (outputDir) {

    const resultsPath = '/results/' + timestamp;
    const folderPath = outputDir + '/' + timestamp;

    let SUMAN_ENV = null;

    async.parallel([
      function (cb) {

        let first = true;

        function onFirst () {
          if (first) {
            first = false;
            cb.apply(null, arguments);
          }
          else {
            console.error(' => Callback called more than once => ', util.inspect(arguments));
          }

        }

        let location = null;
        if (os.platform() === 'win32') {
          location = path.resolve(process.env.APPDATA + '/suman_data');
        }
        else {
          location = path.resolve((process.platform === 'darwin' ? su.getHomeDir() + '/Library/Preferences' : '/var/local') + '/suman_data');
        }

        fs.readFile(location, 'utf-8', (err, data) => {
          //  let file = fs.readFileSync(path.resolve(__dirname + '/../server/views/template.ejs'), 'ascii');

          if (err && err.code !== 'ENOENT') {
            console.log(err.stack);
            onFirst(err);
          }
          else {
            data = JSON.parse(data || '{}');
            if ((data.date && ((Date.now() - data.date) < 3300000 )) && usingLiveSumanServer) {
              SUMAN_ENV = data;
              onFirst(null);
            }
            else {
              data = usingLiveSumanServer ? JSON.stringify({ date: Date.now() }) : JSON.stringify({ notLive: true });
              const strm = fs.createWriteStream(location).on('error', onFirst).on('finish', onFirst);
              strm.write(data);
              strm.end();
            }
          }
        });

      }
    ], function complete (err) {

      if (err) {
        console.log(err.stack);
        cb(err);
      }
      else {
        if (SUMAN_ENV) {
          // runnerLogger.log('\n\n\t(note: data on disk shows browser was opened already)\n\n');
          cb(null);
        }
        else if (!usingLiveSumanServer) {
          //TODO: also log path of where data was saved to
          // runnerLogger.log('\n\n\n\t(note: local suman server is not live)\n');
          cb(null);
        }
        else {
          openBrowser(cb);
        }
      }

    });

    function openBrowser (cb) {

      let autoOpen = true;

      if (process.argv.indexOf('--dao') !== -1) { //does our flag exist?
        autoOpen = false;
      }
      else {
        if (config.disableAutoOpen) {
          autoOpen = false;
        }
      }

      if (autoOpen) {
        if (os.platform() === 'win32') {
          cp.exec('start chrome ' + '"' + url.resolve('http://' + host + ':' + port, resultsPath) + '"', function (error, stdout, stderr) {
            //ee.emit('suman-end');
            cb(null);
          });
        }
        else {
          cp.exec('open -a Firefox ' + url.resolve('http://' + host + ':' + port, resultsPath), function (error, stdout, stderr) {
            //ee.emit('suman-end');
            cb(null);
          });
        }
      }
    }
  }

};

