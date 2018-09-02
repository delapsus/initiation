'use strict';

let path = require('path');
let database = require('./data2/database');
let Person = require('./data2/person');
let Initiation = require('./data2/initiation');
let Location = require('./data2/location');
let dataCache = require('./data-cache');
let submit = require('./submit');

let express = require('express');
var bodyParser = require('body-parser');

exports.start = () => {
    // open the database
    return database.init(database.storageType.file).then(function() {
        // then start accepting connections
        app.listen(getPort());
    }).catch(e => {
        console.error(e);
        process.exit();
    });
};

if (module.parent === null) setTimeout(exports.start, 0);

let app = express();

// host the static stuff out of express
app.use('/client', express.static(path.join(__dirname, '../client')));

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.sendStatus(200);
    }
    // all post will return JSON
    else if  ('POST' === req.method) {
        res.setHeader('Content-Type', 'application/json');
        next();
    }
    else {
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
    if (process && process.env && typeof process.env[name] !== 'undefined') return process.env[name];
    else return 2020;
}

// people search
app.post('/data/people', function (req, res) {
    dataCache.getPeople(req.body)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/person', function (req, res) {

    dataCache.getPerson(req.body.personId)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/person-with-data', function (req, res) {

    dataCache.getPersonWithFullData(req.body.personId)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/merge-person', function (req, res) {

    let masterPersonId = req.body.masterPersonId;
    let slavePersonId = req.body.slavePersonId;

    submit.mergePerson(masterPersonId, slavePersonId)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});


app.post('/data/locations', function (req, res) {
    Location.selectAll()
        .then(results => {
            results.sort((a,b) => {
                if (a.data.name < b.data.name) return -1;
                if (a.data.name > b.data.name) return 1;
                return 0;
            });
            return {locations:results};
        })
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/location', function (req, res) {
    dataCache.getLocation(req.body.locationId)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/location-with-data', function (req, res) {
    dataCache.getLocationWithInitiations(req.body.locationId)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/initiation', function (req, res) {
    dataCache.getInitiation(req.body.initiationId)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/initiations', function (req, res) {
    dataCache.getInitiations(req.body)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/submit-application', function (req, res) {
    submit.submitApplication(req.body)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/submit-edit-person', function (req, res) {
    submit.submitEditPerson(req.body)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/submit-edit-location', function (req, res) {
    submit.submitEditLocation(req.body)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});





/*

function getIpAddress(req) {

    if (req.headers.hasOwnProperty('x-forwarded-for'))
        return req.headers['x-forwarded-for'].split(',').pop();

    return req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

*/