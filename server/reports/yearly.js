let Initiation = require('../data2/initiation');
let Location = require('../data2/location');
let Degree = require('../data2/degree');
//let Database = require('../data2/database');


async function generate(year) {

    let raw = {
        initiations: null,
        locations: null
    };

    //Database.init(Database.storageType.file);

    // load the data
    await Promise.all([
        Initiation.selectAll().then(res => {raw.initiations = res;}), Location.selectAll().then(res => {raw.locations = res;})
    ]);

    // split into locations
    let allLocations = {};

    allLocations[-1] = {
        initiations: [],
        apps: [],
        added: false,
        data: {
            name: 'n/a',
            type: ''
        }

    };

    raw.locations.forEach(l => {
        allLocations[l.locationId] = l;
        l.initiations = [];
        l.apps = [];
        l.added = false;
    });

    // filter to just last years inits that have an actual date
    let min = new Date(`3/1/${year}`);
    let max = new Date(`3/1/${year+1}`);
    let initiations = raw.initiations.filter(initiation => {
        if (initiation.data.actualDate === null) return false;
        let d = new Date(initiation.data.actualDate);
        return d >= min && d < max;
    });

    let apps = raw.initiations.filter(initiation => {
        if (initiation.data.localBodyDate !== null || initiation.data.signedDate !== null || initiation.data.approvedDate !== null) {
            let d = new Date(initiation.data.approvedDate || initiation.data.localBodyDate || initiation.data.signedDate);
            return d >= min && d < max;
        }

        // has a proposed date but no actual date
        if (initiation.data.proposedDate !== null && initiation.data.actualDate === null) {
            let d = new Date(initiation.data.proposedDate);
            return d >= min && d < max;
        }

        // otherwise default to the actual date
        if (initiation.data.actualDate !== null) {
            let d = new Date(initiation.data.actualDate);
            return d >= min && d < max;
        }

        return false;
    });

    // give them to the locations
    let locations = [];
    initiations.forEach(initiation => {
        if (initiation.data.performedAt_locationId === null) {
            //console.log('unknown');
            initiation.data.performedAt_locationId = -1;
            //return false;
        }

        let location = allLocations[initiation.data.performedAt_locationId];
        location.initiations.push(initiation);

        // filter to just locations that have inits
        if (!location.added) {
            locations.push(location);
            location.added = true;
        }

    });

    apps.forEach(initiation => {
        if (initiation.data.performedAt_locationId === null) {
            //console.log('unknown');
            initiation.data.performedAt_locationId = -1;
        }

        let location = allLocations[initiation.data.performedAt_locationId];
        location.apps.push(initiation);

        // filter to just locations that have inits
        if (!location.added) {
            locations.push(location);
            location.added = true;
        }

    });

    // for each of these, separate the inits by degree
    let lines = [];

    // the headers
    let headers = ['Location', 'Type', '0 APP'];
    Degree.values.forEach(degree => {
        headers.push(degree.shortName);
    });
    lines.push(headers);

    //locations.sort((a, b))
    locations.forEach(location => {

        // sort inits by degreeid
        let count = {};
        let appCount = {};
        location.initiations.forEach(initiation => {
            let degreeId = initiation.data.degreeId;
            if (!count.hasOwnProperty(degreeId)) count[degreeId] = 0;
            count[degreeId] += 1;
        });
        location.apps.forEach(initiation => {
            let degreeId = initiation.data.degreeId;
            if (!appCount.hasOwnProperty(degreeId)) appCount[degreeId] = 0;
            appCount[degreeId] += 1;
        });

        // write the line out
        let line = [location.data.name, location.data.type];

        // minerval app
        if (appCount.hasOwnProperty(1)) line.push(appCount[1]);
        else line.push(0);

        // then each init
        Degree.values.forEach(degree => {
            if (count.hasOwnProperty(degree.degreeId)) line.push(count[degree.degreeId]);
            else line.push(0);
        });

        lines.push(line);
    });

    return lines;
    //const fs = require('fs');
    //fs.writeFileSync(`annual${year}.txt`, lines.join('\n'));
}

exports.generate = generate;