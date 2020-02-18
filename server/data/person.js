let table = require('./table');
let record = require('./record');

let tableName = 'Person';

let fields = [
    {name:'personId', type:'number', isPrimary:true},
    {name:'data', type: 'json'}
    ];

let dataFields = [
    {name:'trackingNumber'},
    {name:'createdDate', type:'datetime'},
    {name:'firstName'},
    {name:'middleName'},
    {name:'lastName'},
    {name:'motto'},
    {name:'mottoOld'},
    {name:'mottoComment'},
    {name:'aliases'},
    {name:'addressComments'},
    {name:'primaryAddress'},
    {name:'primaryAddress2'},
    {name:'primaryCity'},
    {name:'primaryPrincipality'},
    {name:'primaryZip'},
    {name:'primaryCountry'},
    {name:'mailAddress'},
    {name:'mailAddress2'},
    {name:'mailCity'},
    {name:'mailPrincipality'},
    {name:'mailZip'},
    {name:'mailCountry'},
    {name:'otherAddress'},
    {name:'otherAddress2'},
    {name:'otherCity'},
    {name:'otherZip'},
    {name:'otherPrincipality'},
    {name:'otherCountry'},
    {name:'phoneComments'},
    {name:'phoneMain'},
    {name:'phoneMain2'},
    {name:'phoneWork'},
    {name:'phoneEmergency'},
    {name:'fax'},
    {name:'email'},
    {name:'birthCity'},
    {name:'birthCountryFirst'},
    {name:'birthCountryMinerval'},
    {name:'birthPrincipality'},
    {name:'birthDate', type:'datetime'},
    {name:'birthTime'},
    {name:'bodyOfResponsibility'},
    {name:'comments'},
    {name:'difficultiesComments'},
    {name:'difficulty', type:'boolean'},
    {name:'isMaster', type:'boolean'},
    {name:'masterOfBody'},
    {name:'reportComment'},
    {name:'isFelon', type:'boolean'},
    {name:'isDuesInactive', type:'boolean'},
    {name:'isInternationalBadReport', type:'boolean'},
    {name:'isResigned', type:'boolean'},

    {name:'importSource'},
];

exports.createTable = async () => {
    return await table.create(tableName, fields);
};

exports.save = async o => {
    await record.save(tableName, fields, o);
};

exports.create = values => {
    return record.createRecord(fields, values, dataFields);
};

exports.selectOne = async personId => {
    return await record.selectOne(tableName, fields, 'personId', personId, convert);
};

exports.selectAll = async () => {
    return await record.selectAll(tableName, fields, convert);
};

// make sure the dates become date objects
const convert = o => {
    if (o.data.createdDate !== null) o.data.createdDate = new Date(o.data.createdDate);
    return o;
};
