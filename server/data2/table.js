const database = require('./database');

/*
name = table name
fields = an array of objects, each represents one of the fields
   {
   name = name of field
   type = number, boolean, datetime, text, or json
   isPrimary = whether or not the field is the key field
   }
 */


exports.create = (name, fields) => {

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
        try {
            database.db.run(`CREATE TABLE ${name} (${sql})`, e => {
                if (e !== null)
                    return reject(e);
                console.log('table created: ' + name);
                resolve();
            });
        }
        catch (e) {
            reject(e);
        }
    });
};