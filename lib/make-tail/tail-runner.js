'use strict';

//polyfills
const process = require('suman-browser-polyfills/modules/process');
const global = require('suman-browser-polyfills/modules/global');

//core
const cp = require('child_process');
const path = require('path');
const os = require('os');

//project
const _suman = global.__suman = (global.__suman || {});
const su = require('suman-utils');

/////////////////////////////////////////////////////////

const projRoot = su.findProjectRoot(process.cwd());
// const file = path.normalize(path.resolve(projRoot + '/suman/logs/runner-stderr.log'));
const file = path.resolve(_suman.sumanHelperDirRoot + '/logs/runner-debug.log');
const file2 = path.normalize(path.resolve(__dirname + '/tail.sh'));

let n;

if (os.platform() === 'win32') {

    //n = cp.spawn('powershell.exe', ['Get-Content','C:\\Users\\denman\\WebstormProjects\\suman-private\\suman\\stdio-logs\\runner-stderr.log','-Wait'], {
    //
    //});
    //n = cp.spawn('start', ['powershell.exe', 'Get-Content', 'C:\\Users\\denman\\WebstormProjects\\suman-private\\suman\\stdio-logs\\runner-stderr.log', '-Wait'], {});

    n = cp.exec('start powershell.exe -NoExit "Get-Content ' + file + ' -Wait"', function (err, stdout, stderr) {

        if (err) {
            console.error(err.stack);
            process.exit(1);
        }
        else {
            process.exit(0);
        }

    });


    //const fileToTail = path.resolve(projRoot + '/suman/stdio-logs/runner-stderr.log');
    //n.stdin.write('Get-Content ' + fileToTail + ' -Wait');


    //const file = path.resolve(__dirname + '/start-tailing-windows.bat');
    //n = cp.exec(file, [], {
    //    detached: true,
    //    env: {
    //        NODE_ENV: process.env.NODE_ENV
    //    }
    //});

}
else {
    // n = cp.spawn('sh', [file2], {});
    cp.exec('bash -e "tail -f ' + file + '"', function (err, stdout, stderr) {
        console.log(err, stdout, stderr);
    });
}


// n.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// });
//
// n.stderr.on('data', (data) => {
//     console.log(`stderr: ${data}`);
// });
//
// n.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
// });
