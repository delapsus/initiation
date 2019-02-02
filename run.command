#!/bin/bash
cd -- "$(dirname "$BASH_SOURCE")"
git pull https://otoinitiation:h4bixKTYeWh3@github.com/asicath/initiation.git
cd server
npm install
cd ../client
npm install
npm run build
cd ..
node ./server/app.js
