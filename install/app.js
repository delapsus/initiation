const fs = require('fs');
const npm = require('npm');


cloneOrUpdate().then(installAndBuild);

function installAndBuild() {
    npm.on("log", function (message) {
        // log the progress of the installation
        console.log(message);
    });

    let npmConfig = JSON.parse(fs.readFileSync('./package.json'));
    npm.load(npmConfig, err => {
        npm.run("installServer", () => {
            npm.run("installClient", () => {
                npm.run("buildClient");
            });
        });
    });
}



function createNpmDependenciesArray(packageFilePath) {
    var p = require(packageFilePath);
    if (!p.dependencies) return [];

    var deps = [];
    for (var mod in p.dependencies) {
        if (mod === 'npm') continue;
        deps.push(mod + "@" + p.dependencies[mod]);
    }

    return deps;
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
                // Now that we're finished fetching, go ahead and merge our local branch
                // with the new one

                //.done(function() {
               //     console.log("Done!");
                //});
        })
        .then(function(repository) {
            // Access any repository methods here.
            console.log("Is the repository bare? %s", Boolean(repository.isBare()));
        })
        .catch(e => {
            console.error(e);
        });
}



