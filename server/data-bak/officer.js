let database = require('./database');

let tableName = 'Officer';

let fields = [
    {name:'officerId', type:'number', isPrimary:true},
    {name:'name'},
    {name:'rank', type:'number'}
];

let values = [
    {name:'Initiator', rank:1},
    {name:'Wazir', rank:2},
    {name:'Emir', rank:3},
    {name:'Zerrubbabel', rank:1},
    {name:'Haggai', rank:2},
    {name:'Joshua', rank:3},
    {name:'Herald', rank:4},
    {name:'Senior Perfect Magician', rank:5},
    {name:'Assistant 1', rank:6},
    {name:'Assistant 2', rank:7},
    {name:'Most Wise Sovereign', rank:8},
    {name:'High Priestess', rank:9},
    {name:'Grand Marshal', rank:10}
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

/*

 OfficerId	OfficerName	Order
 1	Initiator	1
 2	Wazir	2
 3	Emir	3

 5	Zerrubbabel	1
 6	Haggai	2
 7	Joshua	3
 8	Herald	4
 9	SeniorPerfectMagician	5
 10	Assistant1	6
 11	Assistant2	7
 12	MostWiseSovereign	8
 13	HighPriestess	9
 14	GrandMarshal	10

*/
