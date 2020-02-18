const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

exports.db = null;

exports.dbPath = path.resolve(__dirname, '../../initiation.db');

exports.storageType = {
    file: exports.dbPath,
    memory: ':memory:'
};

function backup(filename) {

    fs.copyFile('source.txt', 'destination.txt', (err) => {
        if (err) throw err;
        console.log('source.txt was copied to destination.txt');
    });
}

exports.init = async (filename, createIfMissing) => {

    console.log('opening database: ' + filename);

    if (filename === ':memory:') {
        console.log('initializing from memory');
    }
    else if (!fs.existsSync(filename)) {
        if (createIfMissing) {
            console.warn('.db does not exist, creating...');
        }
        else {
            throw new Error('.db not found');
        }
    }

    await new Promise((resolve, reject) => {
        // just init in memory for now
        exports.db = new sqlite3.Database(filename, e => {
            if (!!e) return reject(e);
            console.log('database initialized');
            resolve();
        });

        //db.serialize(resolve);
    });
};

exports.close = async () => {
    await new Promise((resolve, reject) => {
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
