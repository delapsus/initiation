
to run on mac:

1. install nodejs
2. unencrypt folder with install.js, app.js, package.json, and initiation.db
3. applications -> utilities -> terminal
4. run "npm install"
4. run "node install.js"
6. run "node app.js"








1. install node

2. install git
http://git-scm.com/download/mac
also run these commands to avoid installing xcode
echo "PATH=/usr/local/git/bin:\$PATH" >> ~/.bash_profile
source ~/.bash_profile

3. clone the repo
from terminal:
git clone https://otoinitiation:d61ddeba3de78a584b27625d5161a4b9b025cedd@github.com/asicath/initiation.git

4. run the library install for client/server
npm install

5. build the react
npm run build

6. execute the node
node server



https://apple.stackexchange.com/questions/20104/how-do-i-execute-command-line-scripts

#!/bin/bash
open http://localhost:2020/client/index.html
node app.js




cd initiation
cd server
npm install
cd ..
cd client
npm install
npm run build
cd ..