const fs = require('fs');
const { exec } = require('child_process');

cloneOrUpdate().then(installAndBuild);

function installAndBuild() {

    return installServer()
        .then(installClient)
        .then(buildWebpack)
        .then(() => {
            console.log('complete');
        })
        .catch(e => {
            console.error(e);
        })
}

function installServer() {
    return run('./tmp/server', 'npm install');
}

function installClient() {
    return run('./tmp/client', 'npm install');
}

function buildWebpack() {
    return run('./tmp/client', 'npm run build');
}

function run(workingDir, command) {
    console.log(workingDir + '/' + command);

    return new Promise((resolve, reject) => {
        const process = require('process');

        process.chdir(workingDir);

        exec(command, (err, stdout, stderr) => {

            process.chdir('../..');

            if (err) return reject(err);
            //if (stderr !== null && stderr.length > 0) return reject(new Error(stderr));

            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);

            resolve();
        });
    });

}

function cloneOrUpdate() {
    const NodeGit = require("nodegit");

    let cloneURL = "https://otoinitiation:h4bixKTYeWh3@github.com/asicath/initiation.git";

    let localPath = require("path").join(__dirname, "tmp");

    let cloneOptions = {};
    cloneOptions.fetchOpts = {
        callbacks: {
            certificateCheck: function() { return 1; }
        }
    };

    let cloneRepository = NodeGit.Clone(cloneURL, localPath, cloneOptions);

    return cloneRepository
        .catch(() => {

            return NodeGit.Repository.open(localPath)
                .then(function(repo) {
                    let repository = repo;

                    return repository.fetchAll({
                        callbacks: {
                            credentials: function(url, userName) {
                                return NodeGit.Cred.sshKeyFromAgent(userName);
                            },
                            certificateCheck: function() {
                                return 1;
                            }
                        }
                    })
                        .then(function() {
                            return repository.mergeBranches("master", "origin/master");
                        })
                        .then(() => {
                            return repository;
                        })
                })
        })
        .then(function(repository) {
            // Access any repository methods here.
            console.log("Is the repository bare? %s", Boolean(repository.isBare()));
        })
        .catch(e => {
            console.error(e);
        });
}



