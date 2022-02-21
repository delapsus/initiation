const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let db = null;

const dbPath = path.resolve(__dirname, '../../initiation.db');

const storageType = {
    file: dbPath,
    memory: ':memory:'
};

function backup(filename) {

    fs.copyFile('source.txt', 'destination.txt', (err) => {
        if (err) throw err;
        console.log('source.txt was copied to destination.txt');
    });
}

async function init(filename, createIfMissing) {

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
        db = new sqlite3.Database(filename, e => {
            if (!!e) return reject(e);
            console.log('database initialized');
            resolve();
        });

        //db.serialize(resolve);
    });
}

async function close() {
    await new Promise((resolve, reject) => {
        db.close(e => {
            if (!!e) return reject(e);
            console.log('database closed');
            resolve();
        });
    });
}

async function query(sql) {
    // err, row
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

async function beginTransaction() {
    return new Promise((resolve, reject) => {
        db.run("BEGIN TRANSACTION", err => {
            if (!!err) return reject(err);
            resolve();
        });
    });
}

async function commit() {
    return new Promise((resolve, reject) => {
        db.run("COMMIT", err => {
            if (!!err) return reject(err);
            resolve();
        });
    });
}

async function getRecordCount(table) {
    // err, row
    return new Promise((resolve, reject) => {
        db.get(`select count(*) as count from ${table}`, (err, row) => {
            if (err) return reject(err);
            resolve(row['count']);
        });
    });
}

module.exports = {
    init,
    close,
    query,
    beginTransaction,
    commit,
    getRecordCount,

    storageType,
    get db () {return db;},
    dbPath
};