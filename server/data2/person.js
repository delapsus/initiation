let database = require('./database');
let table = require('./table');
let record = require('./record');

let tableName = 'Person';

let fields = [
    {name:'personId', type:'number', isPrimary:true},
    {name:'data', type: 'json'}
    ];

exports.createTable = () => {
    return table.create(tableName, fields);
};

exports.save = o => {
    return record.save(tableName, fields, o);
};

exports.create = values => {
    return record.createRecord(fields, values);
};

exports.selectOne = personId => {
    return record.selectOne(tableName, fields, 'personId', personId);
};

if (module.parent === null) {
    let record;
    database.init(database.storageType.memory)

        .then(exports.createTable)

        .then(() => {
            let data = {firstName: 'Scott', lastName: 'Wilde', createdDate:new Date(), isMaster:true};
            //let json = JSON.stringify(data);
            record = exports.create({data: data});
            return exports.save(record);
        })

        .then(() => {
            return exports.selectOne(record.personId);
        })

        .then(record => {
            return database.close();
        })

        .catch(e => {
            console.log(e);
        })
        .then(process.exit);
}