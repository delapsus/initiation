let sqlite3 = require('sqlite3').verbose();
let path = require('path');
let fs = require('fs');

exports.db = null;

//exports.dbPath = path.resolve(__dirname, '../../../initiation.db');
exports.dbPath = path.resolve('./initiation.db'); // just use the database in the root dir

exports.storageType = {
    file: exports.dbPath,
    memory: ':memory:'
};

exports.init = (filename, createIfMissing) => {

    console.log('opening database: ' + filename);

    if (!fs.existsSync(filename)) {
        if (createIfMissing) {
            console.warn('.db does not exist, creating...');
        }
        else {
            return Promise.reject(new Error('.db not found'));
        }
    }

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

exports.query = (sql) => {
    // err, row
    return new Promise((resolve, reject) => {
        exports.db.all(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};


exports.beginTransaction = () => {
    return new Promise((resolve, reject) => {
        exports.db.run("BEGIN TRANSACTION", err => {
            if (!!err) return reject(err);
            resolve();
        });
    });
};

exports.commit = () => {
    return new Promise((resolve, reject) => {
        exports.db.run("COMMIT", err => {
            if (!!err) return reject(err);
            resolve();
        });
    });
};

exports.getRecordCount = table => {
    // err, row
    return new Promise((resolve, reject) => {
        exports.db.get(`select count(*) as count from ${table}`, (err, row) => {
            if (err) return reject(err);
            resolve(row['count']);
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