'use strict';

let database = require('./data/database');
let person = require('./data/person');
let initiation = require('./data/initiation');

function trim(text) {
    return (text || "").toLowerCase().trim();
}

exports.execute = () => {

    let persons, initiations, personLookup;

    let counts = {
        empty: [],
        duplicate: []
    };

    let loading = [
        person.selectAll().then(result => {
            persons = result;

            personLookup = {};



            persons.forEach(person => {

                // trim te names
                person.firstName = trim(person.firstName);
                person.middleName = trim(person.middleName);
                person.lastName = trim(person.lastName);

                // ignore empty names
                if (person.firstName.length === 0 && person.lastName.length === 0) {
                    counts.empty.push(person);
                    return;
                }

                // create the key
                let key = person.lastName + "-" + person.firstName;
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
                    //if (other.middleName.length > 0 && person.middleName.length > 0)

                    //console.log('duplicate: ' + key);
                    counts.duplicate.push(person);
                }
                else {
                    personLookup[key] = person;
                }
            });


        }),
        initiation.selectAll().then(result => {
            initiations = result;
        })
    ];

    return Promise.all(loading).then(() => {
        console.log('data loaded, Persons: ' + persons.length + ", Initiations: " + initiations.length);
        console.log('empty: ' + counts.empty.length + ", duplicate: " + counts.duplicate.length);

        let status = {
            found: 0,
            notFound: 0,
            empty: 0,
            dupe: 0
        };

        initiations.forEach(init => {

            init.sponsor1_personId = null;
            init.sponsor2_personId = null;

            if (trim(init.sponsor1First).length === 0 && trim(init.sponsor1Last).length === 0) {
                status.empty++;
            }
            else {
                let p1 = findPerson(init.sponsor1First, init.sponsor1Middle, init.sponsor1Last);

                if (p1 === null) status.notFound++;
                else if (Array.isArray(p1)) status.dupe++;
                else {
                    status.found++;
                    init.sponsor1_personId = p1.personId;
                }
            }

            if (trim(init.sponsor2First).length === 0 && trim(init.sponsor2Last).length === 0) {
                status.empty++;
            }
            else {
                let p2 = findPerson(init.sponsor2First, init.sponsor2Middle, init.sponsor2Last);

                if (p2 === null) status.notFound++;
                else if (Array.isArray(p2)) status.dupe++;
                else {
                    status.found++;
                    init.sponsor2_personId = p2.personId;
                }
            }
        });

        console.log('found: ' + status.found + ", not found: " + status.notFound + ", empty: " + status.empty + ", dupe: " + status.dupe);

        // save!
        let index = 0;

        function saveNext() {

            if (index === initiations.length) return Promise.resolve();

            if (index % 1000 === 0) console.log("update init " + index);

            let init = initiations[index++];
            return initiation.save(init).then(saveNext);
        }

        return database.beginTransaction().then(saveNext).then(database.commit);
    });

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

};







