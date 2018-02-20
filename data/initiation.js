let database = require('./database');

let tableName = 'Initiation';

let fields = [
    {name:'initiationId', type:'number', isPrimary:true},
    {name:'degreeId', type:'number'},
    {name:'personId', type:'number'},
    {name:'locationId', type:'number'},
    {name:'location'},
    {name:'localBody'},
    {name:'localBodyDate', type:'datetime'},
    {name:'signedDate', type:'datetime'},
    {name:'approvedDate', type:'datetime'},
    {name:'proposedDate', type:'datetime'},
    {name:'actualDate', type:'datetime'},
    {name:'reportedDate', type:'datetime'},
    {name:'certReceivedDate', type:'datetime'},
    {name:'certSentOutForSignatureDate', type:'datetime'},
    {name:'certSentOutToBodyDate', type:'datetime'},
    {name:'sponsor1_personId', type:'number'},
    {name:'sponsor2_personId', type:'number'},
    {name:'sponsor1First'},
    {name:'sponsor1Middle'},
    {name:'sponsor1Last'},
    {name:'sponsor1Checked', type:'boolean'},
    {name:'sponsor2First'},
    {name:'sponsor2Middle'},
    {name:'sponsor2Last'},
    {name:'sponsor2Checked', type:'boolean'},
    {name:'testScore'}

    /*,


    {name:'InitiatorName'},
    {name:'InitiatorPhone'},
    {name:'WazirName'},
    {name:'EmirName'},
    {name:'ZerrubbabelName'},
    {name:'HaggaiName'},
    {name:'JoshuaName'},
    {name:'HeraldName'},
    {name:'SeniorPerfectMagicianName'},
    {name:'Assistant1Name'},
    {name:'Assistant2Name'},
    {name:'MostWiseSovereign'},
    {name:'HighPriestess'},
    {name:'GrandMarshal'}*/


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

exports.selectAll = () => {
    return database.selectAll(tableName, fields);
};

exports.getByPersonId = personId => {
    return database.selectMany(tableName, fields, {personId:personId});
};