let database = require('./database');

let tableName = 'Location';

let fields = [
    {name:'locationId', type:'number', isPrimary:true},
    {name:'name'},
    {name:'type'}, // (moe, chapter, usgl)
    {name:'city'},
    {name:'state'}
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

exports.selectOne = locationId => {
    return database.selectOne(tableName, fields, 'locationId', locationId);
};

exports.selectAll = () => {
    return database.selectAll(tableName, fields);
};
