const table = require('./table');
const record = require('./record');

const tableName = 'Person';

const fields = [
    {name:'personId', type:'number', isPrimary:true},
    {name:'data', type: 'json'}
    ];

const dataFields = [
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

async function createTable() {
    return table.create(tableName, fields);
}

async function save(o) {
    return record.save(tableName, fields, o);
}

function create(values) {
    return record.createRecord(fields, values, dataFields);
}

async function selectOne(personId) {
    return record.selectOne(tableName, fields, 'personId', personId, convert);
}

async function selectAll() {
    return record.selectAll(tableName, fields, convert);
}

// make sure the dates become date objects
function convert(o) {
    if (o.data.createdDate !== null) o.data.createdDate = new Date(o.data.createdDate);
    return o;
}

module.exports = {
    createTable,
    create,
    save,
    selectOne,
    selectAll,
    dataFields
};
