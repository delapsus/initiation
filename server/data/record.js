const database = require('./database');

exports.createRecord = (fields, defaultValues, dataFields) => {
    if (typeof defaultValues === 'undefined') defaultValues = null;

    let o = {};
    fields.forEach(field => {
        let key = field.name;
        if (defaultValues !== null && defaultValues.hasOwnProperty(key)) o[key] = defaultValues[key];
        else if (field.hasOwnProperty('defaultValue')) o[key] = field.defaultValue;
        else o[key] = null;
    });

    // setup data fields
    dataFields.forEach(field => {

        // don't overwrite
        if (o.data.hasOwnProperty(field.name)) return;

        let val = null;

        if (field.type === 'boolean') val = false;
        if (field.type === 'array') val = [];

        o.data[field.name] = val;
    });

    return o;
};

exports.selectOne = async (table, fields, idKey, id, convert) => {
    // err, row
    return await new Promise((resolve, reject) => {
        database.db.get(`select * from ${table} where ${idKey}=?`, id, (err, row) => {
            if (err) return reject(err);
            let o = exports.convertRecordToObject(fields, row);
            if (convert !== null) o = convert(o);
            resolve(o);
        });
    });
};

exports.selectMany = async (table, fields, where, convert) => {

    let keys = [];
    let values = [];
    for (let key in where) {
        keys.push(key + "=?");
        values.push(where[key]);
    }

    // err, row
    return await new Promise((resolve, reject) => {
        database.db.all(`select * from ${table} where ${keys.join(',')}`, values, (err, rows) => {
            if (err) return reject(err);
            let a = rows.map(row => {
                let o = exports.convertRecordToObject(fields, row);
                if (convert !== null) o = convert(o);
                return o
            });
            resolve(a);
        });
    });

};

exports.selectAll = async (table, fields, convert) => {
    // err, row
    return await new Promise((resolve, reject) => {
        database.db.all(`select * from ${table}`, (err, rows) => {
            if (err) return reject(err);
            let a = rows.map(row => {
                let o = exports.convertRecordToObject(fields, row);
                if (convert !== null) o = convert(o);
                return o;
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
            else if (field.type === 'number') {
                value = +value;
            }
            else if (field.type === 'json') {
                value = JSON.parse(value);
            }

            o[key] = value;
        }

    });

    return o;
};

exports.save = async (table, fields, o) => {
    let primaryKey = null;
    let isInsert = false;
    await new Promise((resolve, reject) => {
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
                else if (field.type === 'json') {
                    value = JSON.stringify(value);
                }

                values.push(value);
            }

        });

        if (isInsert) {
            let sql = `INSERT INTO ${table} (${fieldNames.join(',')}) VALUES (${valueHolders.join(',')})`;
            database.db.run(sql, values, async err => {
                if (!!err) return reject(err);

                // get the row id and add it back to the object
                const rowid = await getLastInsertRowid();
                o[primaryKey] = rowid;
                resolve();
            });
            /*
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
            */
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
            let stmt = database.db.prepare(sql);

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

async function getLastInsertRowid() {
    // err, row
    return await new Promise((resolve, reject) => {
        database.db.get(`select last_insert_rowid() as rowid`, (err, row) => {
            if (err) return reject(err);
            resolve(row['rowid']);
        });
    });
}
