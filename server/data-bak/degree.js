let database = require('./database');

let tableName = 'Degree';

let fields = [
    {name:'degreeId', type:'number', isPrimary:true},
    {name:'name'},
    {name:'rank', type:'number'}
];

let values = [
    {name:'Minerval', rank:0},
    {name:'First', rank:1},
    {name:'Second', rank:2},
    {name:'Third', rank:3},
    {name:'Fourth', rank:4},
    {name:'PI', rank:5},
    {name:'KEW', rank:6},
    {name:'Fifth', rank:7},
    {name:'KRE', rank:8},
    {name:'Sixth', rank:9},
    {name:'GIC', rank:10},
    {name:'PRS', rank:11},
    {name:'Seventh', rank:12},
    {name:'Eighth', rank:13},
    {name:'Ninth', rank:14},
    {name:'Tenth', rank:15}
];

exports.createTable = () => {
    return database.createTable(tableName, fields).then(() => {
        let index = 0;

        function next() {
            if (index === values.length)
                return Promise.resolve();

            let record = values[index++];

            return exports.save(record).then(next);
        }
        
        return next();
    });
};

exports.create = values => {
    return database.createRecord(fields, values);
};

exports.save = o => {
    return database.save(tableName, fields, o);
};

exports.selectOne = degreeId => {
    return database.selectOne(tableName, fields, 'degreeId', degreeId);
};

exports.selectAll = () => {
    return database.selectAll(tableName, fields);
};