let database = require('./database');
let InitiationOfficer = require('./initiation-officer');
let Person = require('./person');

let tableName = 'Initiation';

let fields = [
    {name:'initiationId', type:'number', isPrimary:true},
    {name:'degreeId', type:'number'},
    {name:'personId', type:'number'},
    {name:'locationId', type:'number'},
    {name:'location'},  // location of initiation
    {name:'localBody'}, // membership
    {name:'localBodyDate', type:'datetime'},
    {name:'signedDate', type:'datetime'},
    {name:'approvedDate', type:'datetime'},
    {name:'proposedDate', type:'datetime'},
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
    {name:'testScore'}

    /*,


    {name:'InitiatorName'},
    {name:'InitiatorPhone'},
    {name:'WazirName'},
    {name:'EmirName'},
    {name:'ZerrubbabelName'},
    {name:'HaggaiName'},
    {name:'JoshuaName'},
    {name:'HeraldName'},
    {name:'SeniorPerfectMagicianName'},
    {name:'Assistant1Name'},
    {name:'Assistant2Name'},
    {name:'MostWiseSovereign'},
    {name:'HighPriestess'},
    {name:'GrandMarshal'}*/


];

exports.createTable = () => {
    return database.createTable(tableName, fields);
};

exports.create = values => {
    return database.createRecord(fields, values);
};

exports.save = o => {
    return database.save(tableName, fields, o);
};

exports.selectAll = () => {
    return database.selectAll(tableName, fields);
};

exports.getByPersonId = personId => {
    return database.selectMany(tableName, fields, {personId:personId});
};

exports.getByLocationId = locationId => {
    return database.selectMany(tableName, fields, {locationId:locationId});
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
