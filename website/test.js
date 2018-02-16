let database = require('../data/database');
let person = require('../data/person');

database.init(database.storageType.file).then(() => {return person.selectOne(250);}).then(record => {
    console.log(record);
});
