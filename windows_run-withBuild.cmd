git pull https://otoinitiation:h4bixKTYeWh3@github.com/asicath/initiation.git
cd server
call npm install
cd ..
cd client
call npm install
call npm build
cd ..
node ./server/app.js
