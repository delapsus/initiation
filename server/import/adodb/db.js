

// Get the adodb module
var ADODB = require('node-adodb');
let fs = require('fs');
ADODB.debug = true;

let connection = null;

function openConnection() {
    if (connection !== null) return Promise.resolve();
    return new Promise(function(resolve, reject) {

        let attemptOpen = function(attempts) {

            if (fs.existsSync('C:\\temp\\initiation.laccdb')) {
                if (attempts < 30) setTimeout(() => {attemptOpen(attempts+1);}, 100);
                else reject('database locked')
            }
            else {
                // Connect to the MS Access DB
                connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\temp\\initiation.accdb;Persist Security Info=False;');
                resolve();
            }

        };

        attemptOpen(0);
    });


}

function execute(sql, attempts) {

    if (typeof attempts === 'undefined') attempts = 0;

    return openConnection().then(() => {
        return new Promise(function(complete, fail) {
            connection
                .execute(sql)
                .on('done', complete)
                .on('fail', fail);
        })
            .catch(function(e) {
                if (e.match(/(?:that prevents it from being opened or locked|file already in use|currently locked|Try again when the database is available|Operation must use an updateable query)/i)) {
                    if (attempts < 15) return execute(sql, attempts+1);
                }

                console.warn(sql);

                return Promise.reject(e);
            });
    })

}

function query(sql, attempts) {

    if (typeof attempts === 'undefined') attempts = 0;

    return openConnection().then(() => {
        return new Promise(function(complete, fail) {
            connection
                .query(sql)
                .on('done', complete)
                .on('fail', fail);
        })
            .catch(function(e) {
                if (e.match(/(?:that prevents it from being opened or locked|file already in use|currently locked|Try again when the database is available|Operation must use an updateable query)/i)) {
                    if (attempts < 15) return execute(sql, attempts+1);
                }

                console.warn(sql);

                return Promise.reject(e);
            });
    })

}

exports.query = (sql) => {
    return query(sql);
};

exports.execute = function(sql) {
    return execute(sql);
};

exports.clearTable = function(table) {
    return execute("delete from " + table);
};

exports.insert = function(table, o) {
    let fields = [];
    let values = [];
    for (let key in o) {
        fields.push(key);
        let value = o[key];

        if (value === null) {
            values.push("NULL");
            continue;
        }

        let t = typeof value;

        if (t === 'undefined') {
            values.push("NULL");
            continue;
        }

        if (t === 'object' && !!value.getTime) t = 'date';

        switch (t) {
            case 'number':
                values.push(value.toString());
                break;
            case 'string':
                value = value.replace(/"/g, '""');
                values.push('"' + value + '"');
                break;
            case 'boolean':
                values.push(value ? 'TRUE' : 'FALSE');
                break;
            case 'date':
                // 4/21/2009 2:25:53 PM use #2009-04-21 14:25:53#

                let d = value.getUTCFullYear() + '-' + (value.getUTCMonth()+1) + '-' + value.getUTCDate();
                if (d === 'NaN-NaN-NaN')
                    console.log('beep ' + value);
                //value = '#' + d + '#';

                values.push('#' + d + '#');
                break;
            default:
                console.log('unknown data type: ' + t);
                values.push(value.toString());
                break;
        }
    }

    let sql = 'INSERT INTO ' + table + ' (' + fields.join(',') + ') VALUES (' + values.join(',') + ');';

    return execute(sql);
};



exports.flushQueue = function() {
    return execute(insertQueue.join('\n'));
};

if (module.parent == null) {

    exports.insert('Person', {FirstName:'Aleister', LastName:'Crowley'})
        .catch(function(e) {
            console.error(e);
        })
        .then(function() {
            //Application.exit();
        })
}


