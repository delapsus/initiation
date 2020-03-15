git pull https://otoinitiation:d61ddeba3de78a584b27625d5161a4b9b025cedd@github.com/asicath/initiation.git
git reset --hard
cd server
call npm install --loglevel=error --no-audit
cd ..
cd client
call npm install --loglevel=error --no-audit
call npm run build
cd ..
node ./server/app.js
