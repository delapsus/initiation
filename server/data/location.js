let database = require('./database');
let table = require('./table');
let record = require('./record');

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

exports.selectOne = locationId => {
    return record.selectOne(tableName, fields, 'locationId', locationId, null);
};

exports.selectAll = () => {
    return record.selectAll(tableName, fields, null);
};


if (module.parent === null) {
    let record;
    database.init(database.storageType.memory)

        .then(exports.createTable)

        .then(() => {
            let data = {name:'Horizon', type:'moe', city:'Seattle', state:'WA'};
            //let json = JSON.stringify(data);
            record = exports.create({data: data});
            return exports.save(record);
        })

        .then(() => {
            return exports.selectOne(record.locationId);
        })

        .then(record => {
            return database.close();
        })

        .catch(e => {
            console.log(e);
        })
        .then(process.exit);
}