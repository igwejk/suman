
//core
const path = require('path');
const fs = require('fs');

//project
const cwd = process.cwd();
const down = [];
let found = false;


let exec;
const execNameIndex = process.argv.indexOf('--exec-name');

if(execNameIndex < 0){
  exec = 'suman/cli.js';
}
else{
  exec = '.bin/' + process.argv[execNameIndex + 1];
}

try{
  fs.mkdirSync(path.resolve(process.env.HOME + '/.suman'));
}
catch(err){

}

const debugLogPath = path.resolve(process.env.HOME + '/.suman/suman-debug.log');

fs.writeFileSync(debugLogPath, '\n\n', { flag: 'a' });
fs.writeFileSync(debugLogPath, ' => Date run => ' + new Date().toISOString(), { flag: 'a' });
fs.writeFileSync(debugLogPath, ' => Running find-local-suman-executable.\n', { flag: 'a' });
fs.writeFileSync(debugLogPath, ' => cwd => ' + cwd, { flag: 'a' });

let p, cd;

function stat (p) {
  try {
    return fs.statSync(p).isFile();
  }
  catch (err) {
    fs.writeFileSync(debugLogPath, '\n => stat error => ' + (err.stack || err), { flag: 'a' });
    if (!String(err.stack || err).match(/ENOENT: no such file or directory/i)) {
      throw err;
    }
    //explicit for your pleasure
    return false;
  }
}

while (true) {

  cd = path.resolve(cwd + down.join(''));

  if (String(cd) === String(path.sep)) {
    // We are down to the root => fail
    fs.writeFileSync(debugLogPath, '\n\n => Fail, (we went down to root "/") => cd => ' + cd, { flag: 'a' });
    break;
  }

  p = path.resolve(cd + '/node_modules/' + exec);

  fs.writeFileSync(debugLogPath, '\n Searching for suman executable at this path => ' + p, { flag: 'a' });

  if (stat(p)) {
    // Found Suman installation path
    found = true;
    break;
  }

  down.push('/../');

}

if (found) {
  fs.writeFileSync(debugLogPath, '\n Found => ' + p, { flag: 'a' });
  console.log(p);
  process.exit(0);
}
else {
  fs.writeFileSync(debugLogPath, '\n * ! Not found * => ' + p, { flag: 'a' });
  process.exit(1);
}
