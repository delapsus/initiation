const { exec } = require('child_process');

const process = require('process');

process.chdir('./tmp/server');

exec('npm install', (err, stdout, stderr) => {
    if (err) {
        // node couldn't execute the command
        return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});