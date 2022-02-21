const Table = require('./table');
const Record = require('./record');

const tableName = 'Location';

const fields = [
    {name:'locationId', type:'number', isPrimary:true},
    {name:'data', type: 'json'}
];

const dataFields = [
    {name:'name'},
    {name:'type'}, // (moe, chapter, usgl)
    {name:'city'},
    {name:'state'}
];

async function createTable() {
    return Table.create(tableName, fields);
}

async function save(o) {
    return Record.save(tableName, fields, o);
}

function create(values) {
    return Record.createRecord(fields, values, dataFields);
}

async function selectOne(locationId) {
    return Record.selectOne(tableName, fields, 'locationId', locationId, null);
}

async function selectAll() {
    return Record.selectAll(tableName, fields, null);
}

module.exports = {
    createTable,
    save,
    create,
    selectOne,
    selectAll
};
