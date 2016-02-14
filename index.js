#!/usr/bin/env node --harmony


/*
if (require.main !== module || process.argv.indexOf('--suman') > -1) {
    //prevents users from fucking up by accident and getting in some possible infinite process.spawn loop that will lock up their system
    console.log('Warning: attempted to require Suman index.js but this cannot be.');
    return;
}
*/

//TODO: need to a suman server stop command at the command line
//TODO, along with options {parallel:true}, {delay:100} we should have {throws:true}, so that we expect a test to throw an error...
//TODO, add option for {timeout: 3000}
//TODO: if error is thrown after test is completed (in a setTimeout, for example) do we handle that?
//TODO: if suman/suman runner runs files and they are not suman suites, then suman needs to report that!!
//TODO: if suman/suman runner runs legit suman tests but the tests have no test cases, it needs to report that too
//TODO: suman -s (server) needs to try user's config first, if that fails, then use default suman config

console.log(' => Suman running...');

var fs = require('fs');
var path = require('path');
var colors = require('colors/safe');
var os = require('os');

////////////////////////////////////////////////////////////////////

var args = JSON.parse(JSON.stringify(process.argv.slice(2))); //copy args
var cwd = process.cwd();

////////////////////////////////////////////////////////////////////

var suman = require('./lib');

var sumanConfig, configPath, index, serverName;


if (args.indexOf('--cfg') !== -1) {
    index = args.indexOf('--cfg');
    configPath = args[index + 1];
    args.splice(index, 2);
}

if (args.indexOf('--n') !== -1) {
    index = args.indexOf('--n');
    serverName = args[index + 1];
    args.splice(index, 2);
}

try {
    var pth = path.resolve(configPath || (cwd + '/' + 'suman.conf.js'));
    sumanConfig = require(pth);
    if (sumanConfig.verbose !== false) {  //default to true
        console.log(colors.cyan(' => Suman config used: ' + pth + '\n'));
    }
    //TODO: There's a potential bug where the user passes a test path to the config argument like so --cfg path/to/test
}
catch (err) {
    //TODO: try to get suman.conf.js from root of project

    console.error('   ' + colors.bgCyan.black('Suman error => Could not find path to your config file in your current working directory or given by --cfg at the command line.'));
    console.error('   ' + colors.bgCyan.black('Suman msg => Using default Suman configuration.'));

    try{
        var pth = path.resolve(__dirname + '/suman.default.conf.js');
        sumanConfig = require(pth);
        if (sumanConfig.verbose !== false) {  //default to true
            console.log(colors.cyan(' => Suman config used: ' + pth + '\n'));
        }
    }
    catch(err){
        console.error('\n => ' + err + '\n');
        return;
    }

}


if (args.indexOf('--server') !== -1 || args.indexOf('-s') !== -1) {

    suman.Server({
        //configPath: 'suman.conf.js',
        config: sumanConfig,
        serverName: serverName || os.hostname()
    }).on('msg', function (msg) {
        console.log('msg from suman server', msg);
        switch (msg) {
            case 'listening':
                process.exit();
                break;
            default:
                console.log(msg);
        }
    });

}
else {

    var dir, grepFile, useRunner;

    if (args.indexOf('--grep-file') !== -1) {
        index = args.indexOf('--grep-file');
        grepFile = args[index + 1];
        args.splice(index, 2);
    }

    if (args.indexOf('--rnr') !== -1) {
        index = args.indexOf('--rnr');
        useRunner = true;
        args.splice(index, 1);
    }

    //whatever args are remaining are assumed to be file or directory paths to tests
    dir = JSON.parse(JSON.stringify(args)).filter(function (item) {
        if (String(item).indexOf('-') === 0) {
            console.log(colors.magenta(' Suman error => Probably a bad command line option "' + item + '", Suman is ignoring it.'))
            return false;
        }
        return true;
    });

    if (dir.length < 1) {
        console.error('   ' + colors.bgCyan('Suman error => No file or dir specified at command line') + '\n\n');
        return;
    }
    else {

        dir = dir.map(function (item) {
            return path.resolve(item);
        });

        if (!useRunner && dir.length === 1 && fs.statSync(dir[0]).isFile()) {
            //TODO: we could read file in (fs.createReadStream) and see if suman is referenced
            console.log('dir[0]:',dir[0]);
            require(dir[0]);  //if only 1 item and the one item is a file, we don't use the runner, we just run that file straight up
        }
        else {
            console.log('dirs:',dir);
            suman.Runner({
                grepFile: grepFile,
                $node_env: process.env.NODE_ENV,
                fileOrDir: dir,
                config: sumanConfig
                //configPath: configPath || 'suman.conf.js'
            }).on('message', function (msg) {
                console.log('msg from suman runner', msg);
                process.exit(msg);
            });
        }

    }
}

