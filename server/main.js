'use strict';

let path = require('path');
let database = require('./data/database');
let Person = require('./data/person');
let Initiation = require('./data/initiation');
let Location = require('./data/location');
let peopleSearch = require('./people-search');

let express = require('express');
var bodyParser = require('body-parser');

exports.start = () => {
    // open the database
    database.init(database.storageType.file).then(function() {
        // then start accepting connections
        app.listen(getPort());
    });
};

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
        res.send(200);
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
    peopleSearch.getPeople(req.body)
        .then(value => { res.send(JSON.stringify(value)); });
});

app.post('/data/person', function (req, res) {
    Person.selectOne(req.body.personId)
        .then(person => {

            let secondary = [];

            // attach initiations and officers
            secondary.push(Initiation.loadForPerson(person, {loadPersons:true}));

            // attach the people this person has sponsored
            secondary.push(Initiation.loadSponsees(person, {loadPersons:true}));

            return Promise.all(secondary).then(() => {return person;})
        })
        .then(value => { res.send(JSON.stringify(value)); });
});


app.post('/data/locations', function (req, res) {
    Location.selectAll()
        .then(results => {
            results.sort((a,b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
            return {locations:results};
        })
        .then(value => { res.send(JSON.stringify(value)); });
});

app.post('/data/location', function (req, res) {
    Location.selectOne(req.body.locationId)
        .then(location => {
            return Initiation.loadForLocation(location, {loadPersons:true})
                .then(() => {return location;});
        })
        .then(value => { res.send(JSON.stringify(value)); });
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