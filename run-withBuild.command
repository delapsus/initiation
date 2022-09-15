#!/bin/bash
cd -- "$(dirname "$BASH_SOURCE")"
git pull https://otoinitiation:d61ddeba3de78a584b27625d5161a4b9b025cedd@github.com/asicath/initiation.git
cd server
npm install --loglevel=error --no-audit
cd ../client
npm install --loglevel=error --no-audit
npm run build
cd ..
node ./server/app.js
