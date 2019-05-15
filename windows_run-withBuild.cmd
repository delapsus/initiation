git pull https://otoinitiation:h4bixKTYeWh3@github.com/asicath/initiation.git
git reset --hard
cd server
call npm install --loglevel=error
cd ..
cd client
call npm install --loglevel=error
call npm run build
cd ..
node ./server/app.js
