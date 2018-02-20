'use strict';
let fs = require('fs');
let excel = require('./import-excel');
let fieldMap = require('./fieldmap');

let database = require('../data/database');
let location = require('../data/location');
let person = require('../data/person');
let degree = require('../data/degree');
let officer = require('../data/officer');
let initiation = require('../data/initiation');
let initiationOfficer = require('../data/initiation-officer');

function execute() {
    let data = excel.loadWorkbook();

    // field count check
    (() => {
        let fieldCount = 0;
        for (let key in data[0]) {fieldCount++;}
        if (fieldCount !== 402) throw new Error('Invalid field count, possibly bad export from FileMakerPro db, make sure not to apply the layout');
        console.log('field count:' + fieldCount);
    })();

    let persons = data.map(fieldMap.createPersonFromFileMakerProRecord);
    console.log('person count: ' + persons.length);

    return database.init(database.storageType.file)
        .then(person.createTable)
        .then(degree.createTable)
        .then(officer.createTable)
        .then(location.createTable)
        .then(initiation.createTable)
        .then(initiationOfficer.createTable)
        .then(() => {

            let index = 0;

            function next() {
                if (index === persons.length)
                    return Promise.resolve();

                if (index % 1000 === 0) console.log(`person ${index}`);

                let record = persons[index++];
                return person.save(record).then(next);
            }

            return database.beginTransaction().then(next).then(database.commit);
        })

        .then(() => {

            let index = 0;
            function next() {
                if (index === persons.length)
                    return Promise.resolve();

                if (index % 1000 === 0) console.log(`person init ${index}`);

                let record = persons[index++];
                return saveInitiations(record).then(next);
            }

            return database.beginTransaction().then(next).then(database.commit);
        })
        .then(() => {
            return Promise.all([
                database.getRecordCount('Location').then(count => { console.log("Location: " + count); }),
                database.getRecordCount('Person').then(count => { console.log("Person: " + count); }),
                database.getRecordCount('Initiation').then(count => { console.log("Initiation: " + count); }),
                database.getRecordCount('InitiationOfficer').then(count => { console.log("InitiationOfficer: " + count); }),
                database.getRecordCount('Degree').then(count => { console.log("Degree: " + count); }),
                database.getRecordCount('Officer').then(count => { console.log("Officer: " + count); })
            ]);
        });

}



let officers = [
    {key:'initiatorName', id:1},
    {key:'wazirName', id:2},
    {key:'emirName', id:3},
    {key:'zerrubbabelName', id:4},
    {key:'haggaiName', id:5},
    {key:'joshuaName', id:6},
    {key:'heraldName', id:7},
    {key:'seniorPerfectMagicianName', id:8},
    {key:'assistant1Name', id:9},
    {key:'assistant2Name', id:10},
    {key:'mostWiseSovereign', id:11},
    {key:'highPriestess', id:12},
    {key:'grandMarshal', id:13},
];

let localBody = {};

function saveInitiations(person) {

    let inits = [];
    let bodySave = [];
    let officerSave = [];

    for (let degreeId in person.initiations) {

        let initiation = person.initiations[degreeId];
        // {key:"Tracking Number", type:"string", db:"PersonId"},

        let degreeInfo = fieldMap.fields.initiations.reduce(function(result, info) {
            if (info.degreeId === +degreeId) return info;
            return result;
        });

        // map the data
        let data = {
            //initiationId: initiationId++,
            degreeId: +degreeId
        };
        degreeInfo.fields.forEach(function(field) {
            if (field.hasOwnProperty('db')) data[field.db] = initiation[field.db];
        });

        // link to parent
        data.personId = person.personId;

        // process lookup fields
        data.temp = {};

        // *** LOCAL BODY ***
        let localBodyName = data.localBody || data.location || null;
        if (localBodyName !== null && localBodyName.length > 0) {

            localBodyName = localBodyName.toLowerCase();
            localBodyName = localBodyName.replace(/(?:lodge|oasis|camp|encampment|chapter|temple|consistory|senate)/g, '');
            localBodyName = localBodyName.replace(/[-.]/g, ' ');
            localBodyName = localBodyName.replace(/[?]/g, '');
            while (localBodyName.match(/\s\s/)) {
                localBodyName = localBodyName.replace(/\s\s/g, ' ');
            }
            localBodyName = localBodyName.trim();

            if (localBody.hasOwnProperty(localBodyName)) {
                data.temp.location = localBody[localBodyName];
            }
            else {
                let lb = location.create({
                    name: localBodyName
                });
                localBody[localBodyName] = lb;
                data.temp.location = lb;

                bodySave.push(location.save(lb));
            }
        }

        // *** INITIATION OFFICERS ***
        officers.forEach(office => {
            if (data.hasOwnProperty(office.key) && data[office.key] !== null && data[office.key].length > 0) {
                officerSave.push({
                    officerId: office.id,
                    name: data[office.key],
                    temp: {
                        initiation: data
                    }
                });
            }
        });

        inits.push(data);
    }

    // allow bodies to finish saving
    return Promise.all(bodySave)
        .then(() => {

            // save the initiations
            let index = 0;

            function next() {
                if (index === inits.length)
                    return Promise.resolve();

                let data = inits[index++];

                // first link the location
                if (data.temp.hasOwnProperty('location')) {
                    data.locationId = data.temp.location.locationId;
                }

                return initiation.save(data).then(next);
            }

            return next();
        })
        .then(() => {
            let saving = [];
            officerSave.forEach(data => {
                data.initiationId = data.temp.initiation.initiationId;
                saving.push(initiationOfficer.save(data));
            });
            return Promise.all(saving);
        });

}

let findNames = require('./find-names');

execute().then(findNames.execute).catch(e => {
    throw e;
}).then(process.exit);

//