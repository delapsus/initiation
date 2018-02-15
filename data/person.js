let database = require('./database');

let tableName = 'Person';

let fields = [
    {name:'personId', type:'number', isPrimary:true},
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
    {name:'isResigned', type:'boolean'}
];

exports.create = values => {
    return database.createRecord(fields, values);
};

exports.save = o => {
    return database.save(tableName, fields, o);
};

exports.createTable = () => {
    return database.createTable(tableName, fields);
};

exports.selectOne = personId => {
    return database.selectOne(tableName, fields, 'personId', personId);
};

exports.selectAll = () => {
    return database.selectAll(tableName, fields);
};

if (module.parent === null) {
    let record;
    database.init()
        .then(() => {
            console.log('database created');
            return exports.createTable()
        })
        .then(() => {
            console.log('table created');
            record = exports.create({firstName: 'Scott', lastName: 'Wilde', createdDate:new Date(), isMaster:true});
            return exports.save(record);
        })

        .then(() => {
            return exports.selectOne(record.personId);
        })
        .then(record => {
            console.log('table created');
            //record = exports.create({firstName: 'Scott', lastName: 'Wilde', createdDate:new Date(), isMaster:true});
            record.lastName = 'Wilder';
            return exports.save(record);
        })

        .then(() => {
            return exports.selectOne(record.personId);
        })

        .then(record => {
            console.log('record created');
            return database.close();
        })

        .catch(e => {
            console.log(e);
        })
        .then(process.exit);
}
