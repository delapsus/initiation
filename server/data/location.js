let Table = require('./table');
let Record = require('./record');

let tableName = 'Location';

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

exports.createTable = async () => {
    return Table.create(tableName, fields);
};

exports.save = async o => {
    await Record.save(tableName, fields, o);
};

exports.create = values => {
    return Record.createRecord(fields, values, dataFields);
};

exports.selectOne = async locationId => {
    return Record.selectOne(tableName, fields, 'locationId', locationId, null);
};

exports.selectAll = async () => {
    return Record.selectAll(tableName, fields, null);
};
