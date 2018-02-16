'use strict';

let http = require('http');
let database = require('../data/database');
let person = require('../data/person');

database.init(database.storageType.file);

let server = http.createServer(function (req, res) {

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

            handleRequest(req.url, req, res, post);
        });
    }

});

let handleRequest = function(url, req, res, post) {
    if (url === '/person') {
        try {
            processProductSearch(req, res, post);
        }
        catch (e) {
            console.log(e.stack);
            writeJsonResponse(res, '{"message": "Error", "e":' + e.message + '}');
        }
    }
};

function getIpAddress(req) {

    if (req.headers.hasOwnProperty('x-forwarded-for'))
        return req.headers['x-forwarded-for'].split(',').pop();

    return req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

let processProductSearch = function(req, res, post) {

    return person.selectOne(250).then(result => {
        writeJsonResponse(res, JSON.stringify(result));
    });

};

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




let getPort = function () {
    let name = 'PORT';
    // try to pull from amazon config
    if (process && process.env && typeof process.env[name] !== 'undefined') return process.env[name];
    else return 2020;
};

server.listen(getPort());
