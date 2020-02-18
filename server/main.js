'use strict';

let path = require('path');
let database = require('./data/database');
let dataCache = require('./data-cache');
let submit = require('./submit');
let annualReport = require('./reports/yearly');
let waitingForInitiationReport = require('./reports/waitingForInitiation');

let express = require('express');
let bodyParser = require('body-parser');
let XLSX = require('xlsx');

exports.start = async () => {
    try {
        // open the database
        await database.init(database.storageType.file);

        // then start accepting connections
        app.listen(getPort());
    }
    catch(e) {
        console.error(e);
        process.exit();
    }
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

app.post('/data/submit-person-picker', async function (req, res) {
    try {
        let personId = await submit.submitPersonPicker(req.body);
        res.send(JSON.stringify({personId: personId}));
    }
    catch(err) { console.error(err); }
});

app.post('/data/submit-location-picker', async function (req, res) {
    try {
        let locationId = await submit.submitLocationPicker(req.body);
        res.send(JSON.stringify({locationId: locationId}));
    }
    catch(err) { console.error(err); }
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
    dataCache.getLocations(req.body)
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
    dataCache.getInitiationWithData(req.body.initiationId)
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

// index.html?page=report-form
app.post('/data/submit-initiation-report', function (req, res) {
    submit.submitInitiationReport(req.body)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/submit-edit-person', function (req, res) {
    submit.submitEditPerson(req.body)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/submit-edit-initiation', function (req, res) {
    submit.submitEditInitiation(req.body)
        .then(value => { res.send(JSON.stringify(value)); })
        .catch(console.error);
});

app.post('/data/submit-edit-location', async function (req, res) {
    try {
        const value = await submit.submitEditLocation(req.body);
        res.send(JSON.stringify(value));
    }
    catch (err) {
        console.error(err);
    }
});

app.get('/report/annual', async function (req, res) {

    // read year from QS
    let year = 1985;
    if (req.query.hasOwnProperty('year')) {
        year = +req.query.year;
    }

    // generate the data
    let data = await annualReport.generate(year);

    // create the workbook
    let wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);

    // add worksheet to workbook
    let ws_name = year.toString();
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    // write the XLSX to response
    let wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
    let filename = `annual-report-${year}_${getDateTimeString()}.xlsx`;
    res.header('Content-Type', "application/octet-stream");
    res.header('Content-disposition', 'attachment;filename=' + filename);
    res.header('Content-Length', wbout.length);

    res.end(new Buffer(wbout, 'binary'));
});

app.get('/report/waiting', async function (req, res) {

    // read year from QS
    let minDegreeId, maxDegreeId, minYearsWaiting, maxYearsWaiting;
    minDegreeId = +req.query.minDegreeId;
    maxDegreeId = +req.query.maxDegreeId;
    minYearsWaiting = +req.query['minYears'];
    maxYearsWaiting = +req.query['maxYears'];

    // generate the data
    let data = await waitingForInitiationReport.generate(minDegreeId, maxDegreeId, minYearsWaiting, maxYearsWaiting);

    // create the workbook
    let wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);

    // add worksheet to workbook
    let ws_name = "waiting for initiation";
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    // write the XLSX to response
    let wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
    let filename = `waiting-for-initiation_${getDateTimeString()}.xlsx`;
    res.header('Content-Type', "application/octet-stream");
    res.header('Content-disposition', 'attachment;filename=' + filename);
    res.header('Content-Length', wbout.length);

    res.end(new Buffer(wbout, 'binary'));
});

function getDateTimeString() {
    var now = new Date();

    var yy = now.getFullYear().toString().substr(2);
    var mm = forceLeadingZero((now.getMonth() + 1).toString());
    var dd = forceLeadingZero(now.getDate().toString());
    var HH = forceLeadingZero(now.getHours().toString());
    var MM = forceLeadingZero(now.getMinutes().toString());
    var SS = forceLeadingZero(now.getSeconds().toString());

    return yy + mm + dd + '-' + HH + MM + SS;
}

function forceLeadingZero(s) {
    if (s.length == 1) return '0' + s;
    return s;
}




/*

function getIpAddress(req) {

    if (req.headers.hasOwnProperty('x-forwarded-for'))
        return req.headers['x-forwarded-for'].split(',').pop();

    return req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

*/