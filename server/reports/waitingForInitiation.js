let Initiation = require('../data2/initiation');
let Location = require('../data2/location');
let Person = require('../data2/person');
let Degree = require('../data2/degree');

async function loadLocations() {
    let raw = await Location.selectAll();
    let all = {};
    raw.forEach(l => {
        all[l.locationId] = l;
    });
    return all;
}

async function loadPersons() {
    let raw = await Person.selectAll();
    let all = {};
    raw.forEach(o => {
        all[o.personId] = o;
    });
    return all;
}


async function generate(minDegreeId, maxDegreeId, minYearsWaiting, maxYearsWaiting) {

    let locations = await loadLocations();
    let initiations = await Initiation.selectAll();
    let persons = await loadPersons();

    // find last/planned init for each person
    let initiationsByPersonId = {};
    initiations.forEach(initiation => {

        // create / get entry
        let personId = initiation.data.personId;
        if (!initiationsByPersonId.hasOwnProperty(personId)) initiationsByPersonId[personId] = {last:null, planned:null};
        let entry = initiationsByPersonId[personId];


        if (initiation.data.actualDate !== null) {
            if (entry.last === null || entry.last.data.degreeId < initiation.data.degreeId) {
                entry.last = initiation;
            }
        }

        // determine if it is planned
        else {
            if (entry.planned === null || entry.planned.data.degreeId < initiation.data.degreeId) {
                entry.planned = initiation;
            }
        }

    });

    // filter out any
    let initiationsByDegree = {};
    let now = Date.now();
    for (let personId in initiationsByPersonId) {
        let entry = initiationsByPersonId[personId];

        // no need to examine any without
        if (entry.last === null) continue;

        // remove invalid planned degrees
        if (entry.planned !== null && entry.planned.data.degreeId < entry.last.data.degreeId) entry.planned = null;

        // create the date
        entry.last.data.actualDate = new Date(entry.last.data.actualDate);
        entry.last.yearsAgo = (now - entry.last.data.actualDate.getTime()) / (1000*60*60*24*365);

        // filter by years
        if (entry.last.yearsAgo < minYearsWaiting || entry.last.yearsAgo > maxYearsWaiting) continue;

        // add to the result
        if (!initiationsByDegree.hasOwnProperty(entry.last.data.degreeId)) initiationsByDegree[entry.last.data.degreeId] = [];
        initiationsByDegree[entry.last.data.degreeId].push(entry);

        // find the location
        if (entry.last.data.performedAt_locationId !== null) {
            entry.last.location = locations[entry.last.data.performedAt_locationId];
        }
        else {
            entry.last.location = null;
        }

        // find the person
        if (entry.last.data.personId !== null) {
            entry.last.person = persons[entry.last.data.personId];
        }

        // find the degree
        entry.last.degree = Degree.lookup[entry.last.data.degreeId];
    }


    // for each of these, separate the inits by degree
    let lines = [];

    // the headers
    let headers = ['First Name', 'Last Name', 'Current Degree', 'Initiation Date', 'Location', 'State', 'Years In Degree', 'Next Degree Planned'];
    lines.push(headers);

    for (let degreeId = minDegreeId; degreeId <= maxDegreeId; degreeId++) {

        if (!initiationsByDegree.hasOwnProperty(degreeId)) continue;

        // get entries for this degree and sort them
        let entries = initiationsByDegree[degreeId];
        entries.sort((a, b) => {
            if (a.last.data.actualDate < b.last.data.actualDate) return -1;
            else if (a.last.data.actualDate > b.last.data.actualDate) return 1;
            else return 0;
        });

        entries.forEach(entry => {
            let fields = [];

            fields.push(entry.last.person.data.firstName);
            fields.push(entry.last.person.data.lastName);
            fields.push(entry.last.degree.shortName);
            fields.push(formatDate(entry.last.data.actualDate));
            if (entry.last.location !== null) {
                fields.push(entry.last.location.data.name);
                fields.push(entry.last.location.data.state);
            }
            else {
                fields.push('');
                fields.push('');
            }
            fields.push(Math.floor(entry.last.yearsAgo * 10)/10);

            fields.push((entry.planned === null) ? 'no' : 'yes');

            lines.push(fields);
        });

    }

    return lines;
}

function formatDate(d) {

    if (typeof d === 'undefined' || d === null) return "";

    if (typeof d === 'string') d = new Date(d);

    let year = d.getUTCFullYear().toString();
    let month = (d.getUTCMonth() + 1).toString();
    let day = d.getUTCDate().toString();

    if (month.length === 1) month = "0" + month;
    if (day.length === 1) day = "0" + day;

    return `${year}-${month}-${day}`;
}

exports.generate = generate;
