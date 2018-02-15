'use strict';
let fs = require('fs');
let excel = require('../import-excel');
let database = require('./db');
let fieldMap = require('../fieldmap').fieldMap;

function execute() {
    let data = excel.loadWorkbook();

    // field count check
    (() => {
        let fieldCount = 0;
        for (let key in data[0]) {fieldCount++;}
        if (fieldCount !== 402) throw new Error('Invalid field count, possibly bad export from FileMakerPro db, make sure not to apply the layout');
        console.log('field count:' + fieldCount);
    })();

    let persons = data.map(createPersonFromFileMakerProRecord);
    console.log('person count: ' + persons.length);

    clearAll()
        /*
        .then(function() {
            let index = 0;
            let next = () => {
                if (index === persons.length) return Promise.resolve();
                if (index % 10 === 0) console.log(index);
                var person = persons[index++];
                return savePerson(person).then(next);
            };
            return next();
        })
        */
        .then(function() {
            let index = 0;
            let next = () => {
                if (index === persons.length) return Promise.resolve();
                if (index % 10 === 0) console.log(index);
                var person = persons[index++];
                return saveInitiations(person).then(next);
            };
            return next();
        })

        .then(() => {console.log('complete');})
        .catch(function(e) {
            console.warn(e);
        })

}

function savePerson(person) {

    // map the data
    let data = {};
    fieldMap.root.forEach(function(field) {
        if (field.hasOwnProperty('db')) data[field.db] = person[field.db];
    });

    let id = data.PersonId.match(/KZT-(\d+)/i);
    data.PersonId = +id[1];

    // find the lookup fields


    return database.insert("Person", data);
}



let officers = [
    {key:'InitiatorName', id:1},
    {key:'WazirName', id:2},
    {key:'EmirName', id:3},
    {key:'ZerrubbabelName', id:5},
    {key:'HaggaiName', id:6},
    {key:'JoshuaName', id:7},
    {key:'HeraldName', id:8},
    {key:'SeniorPerfectMagicianName', id:9},
    {key:'Assistant1Name', id:10},
    {key:'Assistant2Name', id:11},
    {key:'MostWiseSovereign', id:12},
    {key:'HighPriestess', id:13},
    {key:'GrandMarshal', id:14},
];

let initiationId = 1;
let localBody = {};
let localBodyId = 1;

function saveInitiations(person) {

    let inits = [];
    let bodySave = [];
    let officerSave = [];

    for (let degreeId in person.initiations) {

        let initiation = person.initiations[degreeId];
        // {key:"Tracking Number", type:"string", db:"PersonId"},

        let degreeInfo = fieldMap.initiations.reduce(function(result, info) {
            if (info.degreeId === +degreeId) return info;
            return result;
        });

        // map the data
        let data = {
            InitiationId: initiationId++,
            DegreeId: +degreeId
        };
        degreeInfo.fields.forEach(function(field) {
            if (field.hasOwnProperty('db')) data[field.db] = initiation[field.db];
        });

        let id = person.PersonId.match(/KZT-(\d+)/i);
        data.PersonId = +id[1];

        // process lookup fields

        // *** LOCAL BODY ***
        let localBodyName = data.LocalBody || data.Location || null;
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
                data.LocalBodyId = localBody[localBodyName].LocalBodyId;
            }
            else {
                let lb = {
                    LocalBodyId: localBodyId++,
                    LocalBodyName: localBodyName
                };
                localBody[localBodyName] = lb;
                data.LocalBodyId = lb.LocalBodyId;
                bodySave.push(database.save("LocalBody", lb));
            }
        }

        // *** INITIATION OFFICERS ***
        officers.forEach(office => {
            if (data.hasOwnProperty(office.key) && data[office.key] !== null && data[office.key].length > 0) {
                officerSave.push({
                    InitiationId:data.InitiationId,
                    OfficerId:office.id,
                    PersonName: data[office.key]
                });
            }
        });



        inits.push(data);
    }

    return Promise.all(bodySave)
        .then(() => {
            let saving = [];
            inits.forEach(data => {
                saving.push(database.insert("Initiation", data));
            });
            return Promise.all(saving);
        })
        .then(() => {
            let saving = [];
            officerSave.forEach(data => {
                saving.push(database.insert("InitiationOfficer", data));
            });
            return Promise.all(saving);
        });
}



function clearAll() {
    //
    return database.clearTable('InitiationOfficer')
        .then(() => {return database.clearTable('Initiation');})
        .then(() => {return database.clearTable('LocalBody');})
        //.then(() => {return database.clearTable('Person');})
    ;

        //.then(() => {return database.execute('ALTER TABLE Person ALTER COLUMN personId COUNTER(1, 1)')});
}

function createPersonFromFileMakerProRecord(input) {

    // first clean the fields, trim and get rid of undefined
    let record = {};
    for (let key in input) {
        if (typeof input[key] === 'string') {
            input[key] = input[key].trim();
            if (input[key].length > 0) record[key] = input[key];
        }
        else if (typeof input[key] !== 'undefined') {
            record[key] = input[key];
        }
    }


    let o = {
        initiations: {}
    };

    // root fields
    fieldMap.root.forEach(field => {
        parseField(record, o, field);
    });

    if (record['Tracking Number'] === 'KZT-00680') {
        console.log('test');
    }

    // initiation sub records
    fieldMap.initiations.forEach(function(initiation) {

        // first examine the degree flag
        let hasDegree = record.hasOwnProperty(initiation.check);

        // if any of the fields for this degree has data, then disregard the flag
        if (!hasDegree) {
            initiation.fields.forEach(field => {
                if (record.hasOwnProperty(field.key) && typeof record[field.key] !== 'undefined')
                    hasDegree = true;
            });
        }

        // create an initiation record for this degree
        if (hasDegree) {
            let init = {};

            initiation.fields.forEach(field => {
                parseField(record, init, field);
            });

            o.initiations[initiation.degreeId] = init;
        }

    });
    
    return o;
}

function parseField(read, write, field) {
    let value = null;
    if (read.hasOwnProperty(field.key)) {
        let raw = read[field.key];
        value = parseExcelValue(field, raw);
    }

    write[field.hasOwnProperty('db') ? field.db : field.key] = value;
}

function parseExcelValue(field, value) {
    let isUndefined = (typeof value === 'undefined');

    if (field.type === "date") {
        if (isUndefined || value === 0 || typeof value !== 'number') value = null;
        else value = parseExcelSerialDate(value);
    }
    else if (field.type === 'boolean') {
        if (isUndefined || value.length === 0) value = false;
        else {
            value = value.toLowerCase();
            value = !(value === 'false' || value === 'no' || value === 'f' || value === 'n');
        }
    }
    else if (field.type === 'number') {
        if (isUndefined) value = null;
        else value = +value;
    }
    return value;
}

function parseExcelSerialDate(n) {
    let d = new Date((n - (25567 + 2))*86400*1000);

    //36516 12/22/1999
    //7     01/07/1900
    //867   05/16/1902
    //37434 06/27/2002
    let year = d.getUTCFullYear();
    if (year < 1904)
        d.setUTCFullYear(year+100);

    return d;
}


execute();
