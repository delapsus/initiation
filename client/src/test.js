let database = require('../../server/data/database');
let person = require('../../server/data/person');

database.init(database.storageType.file).then(() => {return person.selectOne(250);}).then(record => {
    console.log(record);
});
