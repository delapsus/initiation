var NodeGit = require("nodegit");

var cloneURL = "https://otoinitiation:h4bixKTYeWh3@github.com/asicath/initiation.git";

var localPath = require("path").join(__dirname, "tmp");

var cloneOptions = {};
cloneOptions.fetchOpts = {
    callbacks: {
        certificateCheck: function() { return 1; }
    }
};

var cloneRepository = NodeGit.Clone(cloneURL, localPath, cloneOptions);

cloneRepository
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
            })
            // Now that we're finished fetching, go ahead and merge our local branch
            // with the new one

            .done(function() {
                console.log("Done!");
            });
    })
    .then(function(repository) {
        // Access any repository methods here.
        console.log("Is the repository bare? %s", Boolean(repository.isBare()));
    });


