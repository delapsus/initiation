'use strict';
let fs = require('fs');
let database = require('./db');

let persons, initiations, personLookup;

let counts = {
    empty: [],
    duplicate: []
};

function trim(text) {
    return (text || "").toLowerCase().trim();
}

let loading = [
    database.query('select PersonId, FirstName, MiddleName, LastName from Person').then(result => {
        persons = result;

        personLookup = {};



        persons.forEach(person => {

            // trim te names
            person.FirstName = trim(person.FirstName);
            person.MiddleName = trim(person.MiddleName);
            person.LastName = trim(person.LastName);

            // ignore empty names
            if (person.FirstName.length === 0 && person.LastName.length === 0) {
                counts.empty.push(person);
                return;
            }

            // create the key
            let key = person.LastName + "-" + person.FirstName;
            if (personLookup.hasOwnProperty(key)) {
                let existing = personLookup[key];

                // convert to array if not already
                if (!Array.isArray(existing)) {
                    personLookup[key] = [existing];
                    existing = personLookup[key];
                }

                // store into the array for this key
                existing.push(person);

                // check middle initial?
                //if (other.MiddleName.length > 0 && person.MiddleName.length > 0)

                //console.log('duplicate: ' + key);
                counts.duplicate.push(person);
            }
            else {
                personLookup[key] = person;
            }
        });


    }),
    database.query('select InitiationId, Sponsor1First, Sponsor1Middle, Sponsor1Last, Sponsor2First, Sponsor2Middle, Sponsor2Last from Initiation').then(result => {
        initiations = result;
    })
];

function findPerson(first, middle, last) {
    // trim the names
    first = trim(first);
    middle = trim(middle);
    last = trim(last);

    let key = last + "-" + first;

    if (!personLookup.hasOwnProperty(key)) return null;

    let person = personLookup[key];
    //if (Array.isArray(person)) return null; // no support for middle initial yet

    return person;
}

Promise.all(loading).then(() => {
    console.log('data loaded, Persons: ' + persons.length + ", Initiations: " + initiations.length);
    console.log('empty: ' + counts.empty.length + ", duplicate: " + counts.duplicate.length);

    let status = {
        found: 0,
        notFound: 0,
        empty: 0,
        dupe: 0
    };

    initiations.forEach(init => {

        init.Sponsor1_PersonId = null;
        init.Sponsor2_PersonId = null;

        if (trim(init.Sponsor1First).length === 0 && trim(init.Sponsor1Last).length === 0) {
            status.empty++;
        }
        else {
            let p1 = findPerson(init.Sponsor1First, init.Sponsor1Middle, init.Sponsor1Last);

            if (p1 === null) status.notFound++;
            else if (Array.isArray(p1)) status.dupe++;
            else {
                status.found++;
                init.Sponsor1_PersonId = p1.PersonId;
            }
        }

        if (trim(init.Sponsor2First).length === 0 && trim(init.Sponsor2Last).length === 0) {
            status.empty++;
        }
        else {
            let p2 = findPerson(init.Sponsor2First, init.Sponsor2Middle, init.Sponsor2Last);

            if (p2 === null) status.notFound++;
            else if (Array.isArray(p2)) status.dupe++;
            else {
                status.found++;
                init.Sponsor2_PersonId = p2.PersonId;
            }
        }
    });

    console.log('found: ' + status.found + ", not found: " + status.notFound + ", empty: " + status.empty + ", dupe: " + status.dupe);

    // save!
    let index = 0;

    function saveNext() {

        if (index === initiations.length) return Promise.resolve();

        if (index % 100 === 0) console.log(index);

        let init = initiations[index++];

        let a = [];
        if (init.Sponsor1_PersonId !== null) a.push("Sponsor1_PersonId=" + init.Sponsor1_PersonId);
        if (init.Sponsor2_PersonId !== null) a.push("Sponsor2_PersonId=" + init.Sponsor2_PersonId);

        if (a.length === 0) return saveNext();

        let sql = 'UPDATE Initiation SET ' + a.join(', ') + ' WHERE InitiationId=' + init.InitiationId;
        return database.execute(sql).then(saveNext);
    }

    return saveNext();

}).then(process.exit);



