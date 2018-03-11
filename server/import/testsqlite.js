var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

let personFields = [
    {name:'PersonId', type:'number'},
    {name:'createdDate', type:'datetime'},
    {name:'FirstName'},
    {name:'MiddleName'},
    {name:'LastName'},
    {name:'Motto'},
    {name:'MottoOld'},
    {name:'MottoComment'},
    {name:'Aliases'},
    {name:'AddressComments'},
    {name:'PrimaryAddress'},
    {name:'PrimaryAddress2'},
    {name:'PrimaryCity'},
    {name:'PrimaryPrincipality'},
    {name:'PrimaryZip'},
    {name:'PrimaryCountry'},
    {name:'MailAddress'},
    {name:'MailAddress2'},
    {name:'MailCity'},
    {name:'MailPrincipality'},
    {name:'MailZip'},
    {name:'MailCountry'},
    {name:'OtherAddress'},
    {name:'OtherAddress2'},
    {name:'OtherCity'},
    {name:'OtherZip'},
    {name:'OtherPrincipality'},
    {name:'OtherCountry'},
    {name:'PhoneComments'},
    {name:'PhoneMain'},
    {name:'PhoneMain2'},
    {name:'PhoneWork'},
    {name:'PhoneEmergency'},
    {name:'Fax'},
    {name:'Email'},
    {name:'BirthCity'},
    {name:'BirthCountryFirst'},
    {name:'BirthCountryMinerval'},
    {name:'BirthPrincipality'},
    {name:'BirthDate', type:'datetime'},
    {name:'BirthTime'},
    {name:'BodyOfResponsibility'},
    {name:'Comments'},
    {name:'DifficultiesComments'},
    {name:'Difficulty', type:'boolean'},
    {name:'IsMaster', type:'boolean'},
    {name:'MasterOfBody'},
    {name:'ReportComment'},
    {name:'IsFelon', type:'boolean'},
    {name:'IsDuesInactive', type:'boolean'},
    {name:'IsInternationalBadReport', type:'boolean'},
    {name:'IsResigned', type:'boolean'}
];

function createTable(db, name, fields) {

    let a = [];
    fields.forEach(field => {
        let type = 'TEXT'; // for
        if (field.type === 'number') type = 'INT';
        if (field.type === 'boolean') type = 'INT';

        a.push(field.name + ' ' + type);
    });

    let sql = a.join(', ');

    db.run(`CREATE TABLE ${name} (${sql})`);
}

exports.init = () => {
    return new Promise((resolve, reject) => {
        db.serialize(function() {
            createTable(db, 'Person', personFields);
            resolve();
        });
    })
};

exports.insert = (table, o) => {


    let fields = [];
    let values = [];
    let valueHolders = [];
    personFields.forEach(field => {
        fields.push(field.name);
        valueHolders.push('?');
        if (!o.hasOwnProperty(field.name) || o[field.name] === null) {
            values.push(null);
        }
        else {
            values.push(o[field.name]);
        }
    });
    let sql = `INSERT INTO ${table} (${fields.join(',')}) VALUES (${valueHolders.join(',')})`;
    let stmt = db.prepare(sql);

    stmt.run(values);
    stmt.finalize();
};

exports.close = () => {
    db.close();
};


// test code
exports.init().then(() => {
    exports.insert('Person', {FirstName:'Scott'});
    exports.close();
});



/*
 var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
 for (var i = 0; i < 10; i++) {
 stmt.run("Ipsum " + i);
 }
 stmt.finalize();

 db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
 console.log(row.id + ": " + row.info);
 });


 */
