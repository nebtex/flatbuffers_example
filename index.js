var fs = require('fs');
var spawn = require('child_process').spawn;

fs.readFile(process.argv[2], (err, data) => {
  if (err) throw err;
  spawn('rm', ['-rf', process.argv[2]]);
});
