let sqlite3 = require('sqlite3').verbose();
let path = require('path');

exports.db = null;


exports.storageType = {
    file: path.resolve(__dirname, '../../initiation-test.db'),
    memory: ':memory:'
};

exports.init = filename => {

    return new Promise((resolve, reject) => {
        // just init in memory for now
        exports.db = new sqlite3.Database(filename, e => {
            if (!!e) return reject(e);
            console.log('database initialized');
            resolve();
        });

        //db.serialize(resolve);
    });
};

exports.close = () => {
    return new Promise((resolve, reject) => {
        exports.db.close(e => {
            if (!!e) return reject(e);
            console.log('database closed');
            resolve();
        });
    });
};



if (module.parent === null) {
    let record;
    exports.init(exports.storageType.memory)

        .then(record => {
            return exports.close();
        })

        .catch(e => {
            console.log(e);
        })
        .then(process.exit);
}