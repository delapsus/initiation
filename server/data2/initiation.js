let database = require('./database');
let table = require('./table');
let record = require('./record');
let Person = require('./person');

let tableName = 'Initiation';

let fields = [
    {name:'initiationId', type:'number', isPrimary:true},
    {name:'data', type: 'json'}
];

let dataFields = [
    {name:'degreeId', type:'number'},
    {name:'personId', type:'number'},
    {name:'locationId', type:'number'},

    {name:'location'},  // location of initiation
    {name:'localBody'}, // membership
    {name:'localBodyDate', type:'datetime'}, // ???
    {name:'signedDate', type:'datetime'},
    {name:'proposedDate', type:'datetime'},
    {name:'approvedDate', type:'datetime'},
    {name:'actualDate', type:'datetime'},
    {name:'reportedDate', type:'datetime'},
    {name:'certReceivedDate', type:'datetime'},
    {name:'certSentOutForSignatureDate', type:'datetime'},
    {name:'certSentOutToBodyDate', type:'datetime'},
    {name:'sponsor1_personId', type:'number'},
    {name:'sponsor2_personId', type:'number'},
    {name:'sponsor1First'},
    {name:'sponsor1Middle'},
    {name:'sponsor1Last'},
    {name:'sponsor1Checked', type:'boolean'},
    {name:'sponsor2First'},
    {name:'sponsor2Middle'},
    {name:'sponsor2Last'},
    {name:'sponsor2Checked', type:'boolean'},
    {name:'testScore'},

    // stored in initiator phone/email in old database
    {name:'contactName'},
    {name:'contactPhone'},
    {name:'contactEmail'},

    {name: 'officers', type:'array'} // {"officerId":2,"name":"Rayan Rivera-Montez","personId":9440}
];

exports.createTable = () => {
    return table.create(tableName, fields);
};

exports.save = o => {
    return record.save(tableName, fields, o);
};

exports.create = values => {
    const o = record.createRecord(fields, values, dataFields);
    return o;
};


exports.selectOne = initiationId => {
    return record.selectOne(tableName, fields, 'initiationId', initiationId, convert);
};

exports.selectAll = () => {
    return record.selectAll(tableName, fields, convert);
};

const convert = o => {
    o.data.localBodyDate = fixDateString(o.data.localBodyDate);
    o.data.signedDate = fixDateString(o.data.signedDate);
    o.data.proposedDate = fixDateString(o.data.proposedDate);
    o.data.approvedDate = fixDateString(o.data.approvedDate);
    o.data.actualDate = fixDateString(o.data.actualDate);
    o.data.reportedDate = fixDateString(o.data.reportedDate);
    o.data.certReceivedDate = fixDateString(o.data.certReceivedDate);
    o.data.certSentOutForSignatureDate = fixDateString(o.data.certSentOutForSignatureDate);
    o.data.certSentOutToBodyDate = fixDateString(o.data.certSentOutToBodyDate);

    return o;
};

function fixDateString(s) {
    if (s === null) return s;
    return new Date(s);
}



exports.getByPersonId = personId => {
    return record.selectMany(tableName, fields, {personId:personId});
};

exports.getByLocationId = locationId => {
    return record.selectMany(tableName, fields, {locationId:locationId});
};

exports.loadForPerson = (person, options) => {
    if (typeof options === 'undefined') options = {};

    return exports.getByPersonId(person.personId).then(initiations => {
        person.initiations = initiations;

        let loading = [];

        if (options.loadPersons) {
            loading.push(Person.loadSponsorsInInitiations(person.initiations));
        }

        if (options.loadOfficers) {

            // load the initiation officer data
            person.initiations.forEach(initiation => {
                let load = InitiationOfficer.selectByInitiationId(initiation.initiationId)
                    .then(officers => {
                        initiation.officers = officers;

                        // get the person data on each officer if requested
                        if (options.loadPersons) {
                            let loadOfficers = initiation.officers.map(officer => {
                                if (officer.personId === null) return Promise.resolve();
                                else return Person.selectOne(officer.personId).then(result => {
                                    officer.person = result;
                                });
                            });
                            return Promise.all(loadOfficers);
                        }
                    });

                loading.push(load);
            });

        }

        // finally return person for chaining
        return Promise.all(loading).then(() => { return person; });
    });
};

function sortActualDate(a, b) {
    if (a.actualDate < b.actualDate) return -1;
    if (a.actualDate > b.actualDate) return 1;
    return 0;
}

exports.loadForLocation = (location, options) => {
    if (typeof options === 'undefined') options = {};

    return exports.getByLocationId(location.locationId).then(initiations => {

        initiations.sort(sortActualDate);

        location.initiations = initiations;
    });
};

exports.loadSponsees = (person, options) => {
    if (typeof options === 'undefined') options = {};

    return Promise.all([
        database.selectMany(tableName, fields, {sponsor1_personId: person.personId}),
        database.selectMany(tableName, fields, {sponsor2_personId: person.personId})
    ])
        .then(results => {
            person.sponsoredInitiations = results[0].concat(results[1]);
            person.sponsoredInitiations.sort((a, b) => {
                if (a.actualDate < b.actualDate) return -1;
                if (a.actualDate > b.actualDate) return 1;
                return 0;
            });

            console.log("sponsored: " + person.sponsoredInitiations.length);

            let loading = [];

            // load the person data
            loading.push(Person.loadSponsorsInInitiations(person.sponsoredInitiations));

            person.sponsoredInitiations.forEach(init => {
                loading.push(Person.selectOne(init.personId).then(p => {
                    init.person = p;
                }));
            });

            return Promise.all(loading);
        });

};


if (module.parent === null) {
    let record;
    database.init(database.storageType.memory)

        .then(exports.createTable)

        .then(() => {
            let data = {degreeId: 1, personId: 1, proposedDate: new Date('1/1/2017')};
            //let json = JSON.stringify(data);
            record = exports.create({data:data});
            return exports.save(record);
        })

        .then(() => {
            return exports.selectOne(record.initiationId);
        })

        .then(record => {
            return database.close();
        })

        .catch(e => {
            console.log(e);
        })
        .then(process.exit);
}