
let database = require('./database');

let tableName = 'InitiationOfficer';

let fields = [
    {name:'initiationOfficerId', type:'number', isPrimary:true},
    {name:'initiationId', type:'number'},
    {name:'officerId', type:'number'},
    {name:'personId', type:'number'},
    {name:'name'},
    {name:'phone'}
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

exports.selectByInitiationId = initiationId => {
    return database.selectMany(tableName, fields, {initiationId: initiationId});
};