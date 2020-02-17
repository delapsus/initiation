'use strict';
let fs = require('fs');
let excel = require('./import-excel');
let fieldMap = require('./fieldmap');

let database = require('../data2/database');
let location = require('../data2/location');
let person = require('../data2/person');
let initiation = require('../data2/initiation');

function execute() {
    let data = excel.loadWorkbook();
    let personRecords = [];

    // field count check
    (() => {
        let fieldCount = 0;
        for (let key in data[0]) {fieldCount++;}
        if (fieldCount !== 402) throw new Error(`Invalid field count ${fieldCount}, possibly bad export from FileMakerPro db, make sure not to apply the layout`);
        console.log('field count:' + fieldCount);
    })();

    let persons = data.map(fieldMap.createPersonFromFileMakerProRecord);
    console.log('person count: ' + persons.length);


    return database.init(database.storageType.file, true)
    //return database.init(database.storageType.memory)
        .then(person.createTable)
        .then(location.createTable)
        .then(initiation.createTable)
        .then(() => {

            let index = 0;

            function next() {
                if (index === persons.length)
                    return Promise.resolve();

                if (index % 1000 === 0) console.log(`person ${index}`);

                let data = persons[index++];
                let initiations = data.initiations;

                // remove all but initiation
                let o = {};
                for (let key in data) {
                    if (key === 'initiations') {}
                    else {
                        o[key] = data[key];
                    }
                }
                data = o;

                data.importSource = "main";

                let record = person.create({data: data});

                record.initiations = initiations;
                personRecords.push(record);

                return person.save(record).then(next);
            }

            return database.beginTransaction().then(next).then(database.commit);
        })

        .then(() => {

            let index = 0;
            function next() {
                if (index === personRecords.length)
                    return Promise.resolve();

                if (index % 1000 === 0) console.log(`person init ${index}`);

                let record = personRecords[index++];
                return saveInitiations(record).then(next);
            }

            return database.beginTransaction().then(next).then(database.commit);
        })
        .then(() => {
            return Promise.all([
                database.getRecordCount('Location').then(count => { console.log("Location: " + count); }),
                database.getRecordCount('Person').then(count => { console.log("Person: " + count); }),
                database.getRecordCount('Initiation').then(count => { console.log("Initiation: " + count); })
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

function saveInitiations(person) {

    let saving = [];

    for (let degreeId in person.initiations) {

        let init = person.initiations[degreeId];

        // get the field mapping
        let degreeInfo = fieldMap.fields.initiations.reduce(function(result, info) {
            if (info.degreeId === +degreeId) return info;
            return result;
        });

        // map the data
        let data = {
            degreeId: +degreeId
        };
        degreeInfo.fields.forEach(function(field) {
            if (field.hasOwnProperty('db')) data[field.db] = init[field.db];
        });

        // link to parent
        data.personId = person.personId;

        // *** INITIATION OFFICERS ***
        data.officers = [];

        // look through each potential officer
        officers.forEach(office => {
            if (data.hasOwnProperty(office.key) && data[office.key] !== null && data[office.key].length > 0) {
                data.officers.push({
                    officerId: office.id,
                    name: data[office.key] // we will link these up to personId in a post import process
                });
            }
        });

        // finally create the record
        let record = initiation.create({data: data});
        saving.push(initiation.save(record));
    }

    return Promise.all(saving);
}

let findNames = require('./find-names');
let findLocations = require('./find-locations');

execute().then(findLocations.execute).then(findNames.execute).catch(e => {
    throw e;
}).then(process.exit);

//