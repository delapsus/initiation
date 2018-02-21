let database = require('./database');
let InitiationOfficer = require('./initiation-officer');
let Person = require('./person');

let tableName = 'Initiation';

let fields = [
    {name:'initiationId', type:'number', isPrimary:true},
    {name:'degreeId', type:'number'},
    {name:'personId', type:'number'},
    {name:'locationId', type:'number'},
    {name:'location'},
    {name:'localBody'},
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

exports.loadForPerson = (person, options) => {
    if (typeof options === 'undefined') options = {};

    return exports.getByPersonId(person.personId).then(initiations => {
        person.initiations = initiations;

        let loading = [];

        if (options.loadPersons) {
            // load the person for each sponsor if present
            person.initiations.forEach(initiation => {
                if (initiation.sponsor1_personId !== null) {
                    loading.push(Person.selectOne(initiation.sponsor1_personId).then(result => {
                        initiation.sponsor1_person = result;
                    }));
                }
                if (initiation.sponsor2_personId !== null) {
                    loading.push(Person.selectOne(initiation.sponsor2_personId).then(result => {
                        initiation.sponsor2_person = result;
                    }));
                }
            });
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
                                })
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