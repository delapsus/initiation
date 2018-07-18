let database = require('./database');
let table = require('./table');
let record = require('./record');

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

    {name: 'officers', type:'array'}
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