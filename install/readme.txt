to run on mac:

1. install nodejs, any version is fine - https://nodejs.org/en/
2. install git - https://git-scm.com/ - unfortunately you must install the developer tools > 1GB
3. run install.command - this will create a folder "initiation"
4. unencrypt initiation.db and put it in the initiation folder
5. double click "run-withBuild.command"

run-withBuild pulls down the latest version and builds it but it takes a while
If you do not expect any changes have been made to the database code, you can just use run, which should start up instantly

If for some reason the .command files won't execute you need to open up terminal and run:
chmod u+x ~/desktop/initiation/run-withBuild.command
(assuming initiation lives in the desktop folder)
