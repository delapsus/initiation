let sqlite3 = require('sqlite3').verbose();

let db = null;

exports.init = () => {

    return new Promise((resolve, reject) => {
        // just init in memory for now
        db = new sqlite3.Database(':memory:', e => {
            if (!!e) return reject(e);
            resolve();
        });

        //db.serialize(resolve);
    });
};


exports.createTable = (name, fields) => {

    return new Promise((resolve, reject) => {
        let a = [];
        fields.forEach(field => {
            let type = 'TEXT'; // for
            if (field.type === 'number') type = 'INTEGER';
            if (field.type === 'boolean') type = 'INTEGER';
            if (field.type === 'datetime') type = 'REAL';
            if (field.isPrimary) type = 'INTEGER PRIMARY KEY ASC';

            a.push(field.name + ' ' + type);
        });

        let sql = a.join(', ');

        db.run(`CREATE TABLE ${name} (${sql})`, e => {
            if (e !== null) return reject(e);
            resolve();
        });
    });
};

exports.getRecordCount = table => {
    // err, row
    return new Promise((resolve, reject) => {
        db.get(`select count(*) as count from ${table}`, (err, row) => {
            if (err) return reject(err);
            resolve(row['count']);
        });
    });
};

exports.getLastInsertRowid = () => {
    // err, row
    return new Promise((resolve, reject) => {
        db.get(`select last_insert_rowid() as rowid`, (err, row) => {
            if (err) return reject(err);
            resolve(row['rowid']);
        });
    });
};

exports.selectOne = (table, fields, idKey, id) => {
    // err, row
    return new Promise((resolve, reject) => {
        db.get(`select * from ${table} where ${idKey}=?`, id, (err, row) => {
            if (err) return reject(err);
            resolve(exports.convertRecordToObject(fields, row));
        });
    });
};

exports.selectAll = (table, fields) => {
    // err, row
    return new Promise((resolve, reject) => {
        db.all(`select * from ${table}`, (err, rows) => {
            if (err) return reject(err);
            let a = rows.map(row => {
                return exports.convertRecordToObject(fields, row);
            });
            resolve(a);
        });
    });
};

exports.convertRecordToObject = (fields, record) => {
    let o = {};

    fields.forEach(field => {
        let key = field.name;

        if (record.hasOwnProperty(key)) {
            let value = record[key];
            if (value === null) {}
            else if (field.type === 'datetime') {
                value = new Date(value);
            }
            else if (field.type === 'boolean') {
                value = value === 1;
            }

            o[key] = value;
        }

    });

    return o;
};

exports.query = (sql) => {
    // err, row
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

//()

exports.save = (table, fields, o) => {
    let primaryKey = null;
    let isInsert = false;
    return new Promise((resolve, reject) => {
        let fieldNames = [];
        let values = [];
        let valueHolders = [];

        fields.forEach(field => {
            let key = field.name;

            if (field.isPrimary) {
                primaryKey = key;
                if (!o.hasOwnProperty(key) || o[key] === null) isInsert = true;
            }

            if (o.hasOwnProperty(key)) {
                fieldNames.push(key);
                valueHolders.push('?');

                let value = o[key];
                if (value === null) {}
                else if (field.type === 'datetime') {
                    value = value.getTime();
                }
                else if (field.type === 'boolean') {
                    value = value ? 1 : 0;
                }

                values.push(value);
            }

        });

        if (isInsert) {
            let sql = `INSERT INTO ${table} (${fieldNames.join(',')}) VALUES (${valueHolders.join(',')})`;
            let stmt = db.prepare(sql);

            stmt.run(values, e => {
                if (!!e) return reject(e);
                stmt.finalize(e2 => {
                    if (!!e2) return reject(e2);

                    exports.getLastInsertRowid().then(rowid => {
                        o[primaryKey] = rowid;
                        resolve();
                    });

                });
            });
        }
        else {
            let updateFields = [];
            let updateValues = [];
            let id = null;
            fieldNames.forEach((fieldName, i) => {
                if (fieldName === primaryKey) {
                    id = values[i];
                } else {
                    updateFields.push(fieldName + "=?");
                    updateValues.push(values[i]);
                }
            });

            updateValues.push(id);

            let sql = `UPDATE ${table} SET ${updateFields.join(',')} WHERE ${primaryKey}=?`;
            let stmt = db.prepare(sql);

            stmt.run(updateValues, e => {
                if (!!e) return reject(e);
                stmt.finalize(e2 => {
                    if (!!e2) return reject(e2);
                    resolve();
                });
            });
        }


    });
};

exports.close = () => {
    return new Promise((resolve, reject) => {
        db.close(e => {
            if (!!e) return reject(e);
            resolve();
        });
    });
};

exports.createRecord = (fields, defaultValues) => {
    if (typeof defaultValues === 'undefined') defaultValues = null;

    let o = {};
    fields.forEach(field => {
        let key = field.name;
        if (defaultValues !== null && defaultValues.hasOwnProperty(key)) o[key] = defaultValues[key];
        else if (field.hasOwnProperty('defaultValue')) o[key] = field.defaultValue;
        else o[key] = null;
    });

    return o;
};
