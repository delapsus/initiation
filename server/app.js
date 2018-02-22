'use strict';

let http = require('http');
let database = require('../data/database');
let Person = require('../data/person');
let Initiation = require('../data/initiation');
let Location = require('../data/location');

let peopleSearch = require('./people-search');

database.init(database.storageType.file);

let server = http.createServer(function (req, res) {

    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
        var headers = {};
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
        return;
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            let post;
            try {
                post = JSON.parse(body);
            }
            catch(e) {
                let item = {
                    isText: true,
                    content: 'Error parsing input json: "' + body + '"'
                };
                writeJsonResponse(res, JSON.stringify(item));
                return;
            }

            handleRequest(req.url, req, res, post)
                .then(result => {
                    writeJsonResponse(res, JSON.stringify(result));
                })
                .catch(e => {
                    console.error(e);
                    //throw e;
                });
        });
    }

});

function getIpAddress(req) {

    if (req.headers.hasOwnProperty('x-forwarded-for'))
        return req.headers['x-forwarded-for'].split(',').pop();

    return req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

let writeJsonResponse = function(res, msg) {

    let head = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    res.writeHead(200, head);
    res.end(msg);
};

let handleRequest = function(url, req, res, post) {
    if (url === '/person') return getPerson(post);
    else if (url === '/people') return peopleSearch.getPeople(post);
    else if (url === '/location') return getLocation(post);
    else if (url === '/locations') return Location.selectAll().then(results => {
        results.sort((a,b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        return {locations:results};
    })
};

let getPerson = function(post) {
    return Person.selectOne(post.personId)
        .then(person => {

            let secondary = [];

            // attach initiations and officers
            secondary.push(Initiation.loadForPerson(person, {loadPersons:true}));

            // attach the people this person has sponsored
            secondary.push(Initiation.loadSponsees(person, {loadPersons:true}));

            return Promise.all(secondary).then(() => {return person;})
        });
};

let getLocation = function(post) {
    return Location.selectOne(post.locationId)
        .then(location => {

            return location;
        });
};


let getPort = function () {
    let name = 'PORT';
    // try to pull from amazon config
    if (process && process.env && typeof process.env[name] !== 'undefined') return process.env[name];
    else return 2020;
};

server.listen(getPort());
