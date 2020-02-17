git pull https://otoinitiation:h4bixKTYeWh3@github.com/asicath/initiation.git
git reset --hard
cd server
call npm install --loglevel=error --no-audit
cd ..
cd client
call npm install --loglevel=error --no-audit
call npm run build
cd ..
node ./server/app.js
