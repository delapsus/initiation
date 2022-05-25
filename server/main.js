'use strict';

let path = require('path');
let database = require('./data/database');
let peopleRoutes = require('./routes/people/index');
let locationRoutes = require('./routes/locations/index');
let applicationRoutes = require('./routes/applications/index');
let initiationRoutes = require('./routes/initiations/index');
let reportRoutes = require('./routes/reports/index')
let express = require('express');
let bodyParser = require('body-parser');

exports.start = async () => {
  try {
    // open the database
    await database.init(database.storageType.file);

    // then start accepting connections
    app.listen(getPort());
  } catch (e) {
    console.error(e);
    process.exit();
  }
};

if (module.parent === null) setTimeout(exports.start, 0);

let app = express();

// host the static stuff out of express
app.use('/client', express.static(path.join(__dirname, '../client')));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.sendStatus(200);
  }
  // all post will return JSON
  else if ('POST' === req.method) {
    res.setHeader('Content-Type', 'application/json');
    next();
  } else {
    //move on
    next();
  }
});
// post handlers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function getPort() {
  let name = 'PORT';
  // try to pull from amazon config
  if (process && process.env && typeof process.env[name] !== 'undefined')
    return process.env[name];
  else return 2020;
}
app.use('/data/people', peopleRoutes);
app.use('/data/locations', locationRoutes);
app.use('/data/applications', applicationRoutes);
app.use('/data/initiation', initiationRoutes);
app.use('/data/reports', reportRoutes);