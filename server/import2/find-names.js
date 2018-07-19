'use strict';

let database = require('../data2/database');
let Person = require('../data2/person');
let initiation = require('../data2/initiation');

function trim(text) {
    return (text || "").toLowerCase().trim();
}

exports.execute = () => {

    let persons, initiations, personLookup;

    let counts = {
        empty: [],
        duplicate: []
    };

    function addToLookup(person) {

        let entry = {personId: person.personId};

        // trim the names
        entry.firstName = trim(person.data.firstName);
        entry.middleName = trim(person.data.middleName);
        entry.lastName = trim(person.data.lastName);

        // clean middle name
        entry.middleName = entry.middleName.replace(/[^0-9a-z\s]/gi, ' ').toLowerCase();
        while (entry.middleName.match(/\s\s/)) { entry.middleName = entry.middleName.replace(/\s\s/g, ' '); } // remove double space
        entry.middleName = entry.middleName.trim();

        // ignore empty names
        if (entry.firstName.length === 0 && entry.lastName.length === 0) {
            counts.empty.push(entry);
            return;
        }

        function addToLookup(key, entry) {
            if (personLookup.hasOwnProperty(key)) {
                let existing = personLookup[key];

                // convert to array if not already
                if (!Array.isArray(existing)) {
                    personLookup[key] = [existing];
                    existing = personLookup[key];
                }

                // store into the array for this key
                existing.push(entry);

                // check middle initial?
                //if (other.middleName.length > 0 && person.middleName.length > 0)

                //console.log('duplicate: ' + key);
                counts.duplicate.push(entry);
            }
            else {
                personLookup[key] = entry;
            }
        }

        // create the key
        let key1 = entry.firstName + " " + entry.lastName;
        addToLookup(key1, entry);

        if (entry.middleName.length === 0) return;

        // add with middle initial
        let key2 = entry.firstName + " " + entry.middleName[0] + " " + entry.lastName;
        addToLookup(key2, entry);

        if (entry.middleName.length === 1) return;

        // add with full middle
        let key3 = entry.firstName + " " + entry.middleName + " " + entry.lastName;
        addToLookup(key3, entry);
    }

    let loading = [
        Person.selectAll().then(result => {
            persons = result;

            // create lookup
            personLookup = {};
            persons.forEach(person => {
                addToLookup(person);
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
            dupe: 0,

            officersFound: 0,
            officersNotFound: 0,
            officersDupe: 0
        };

        let newPeople = [];

        function findByName(first, middle, last) {
            let personId = null;

            if (trim(first).length === 0 && trim(last).length === 0) {
                status.empty++;
            }
            else {
                let p = findPerson(first, middle, last);

                if (p === null) {

                    status.notFound++;

                    // create a new person entry
                    let data = {firstName: first, middleName: middle, lastName: last, createdDate:new Date(), importSource: "sponsor"};
                    let record = Person.create({data: data});
                    newPeople.push(record);

                    return Person.save(record).then(() => {
                        // add to the lookup
                        addToLookup(record);
                        return record.personId;
                    })
                }
                else if (Array.isArray(p)) {
                    status.dupe++;
                }
                else {
                    status.found++;
                    personId = p.personId;
                }
            }

            return Promise.resolve(personId);
        }


        let initIndex = 0;

        function processNextInit() {

            if (initIndex === initiations.length) {
                console.log('found: ' + status.found + ", not found: " + status.notFound + ", empty: " + status.empty + ", dupe: " + status.dupe + ", officersFound: " + status.officersFound + ", officersNotFound: " + status.officersNotFound + ", officersDupe: " + status.officersDupe);
                return Promise.resolve();
            }

            let init = initiations[initIndex++];

            let finding = [
                // *** SPONSOR 1 ***
                findByName(init.data.sponsor1First, init.data.sponsor1Middle, init.data.sponsor1Last).then(id => {init.data.sponsor1_personId = id;}),
                // *** SPONSOR 2 ***
                findByName(init.data.sponsor2First, init.data.sponsor2Middle, init.data.sponsor2Last).then(id => {init.data.sponsor2_personId = id;})
                ];

            // *** OFFICERS ***
            init.data.officers.forEach(officer => {


                let key = officer.name.replace(/[^0-9a-z\s]/gi, '').toLowerCase();
                while (key.match(/\s\s/)) { key = key.replace(/\s\s/g, ' '); } // remove double space
                key = key.trim();


                let result = findPersonByKey(key);
                if (result !== null) {
                    if (!Array.isArray(result)) {
                        officer.personId = result.personId;
                        status.officersFound++;
                    }
                    else {
                        status.officersDupe++;
                    }
                }
                else {
                    // TODO person not found, create a new record
                    status.officersNotFound++;

                    // if just a first and last name, lets go ahead and create it
                    let parts = key.split(' ');
                    if (parts.length === 2) {

                        if (parts[0].length > 2 && parts[1].length > 2) {
                            finding.push(findByName(parts[0], "", parts[1]).then(id => {officer.personId = id;}));
                        }

                    }
                    else {
                        console.log(key);
                    }
                }


                // typed name to just alpha chars, compare against firstlast and firstmiddlelast and firstmiddleIlast

                // del campo, Bonnie Henderson - Winnie, Lon Milo Du Quette
                // du

                /*
                let parts = officer.name.split(' ');
                if (parts.length === 2) {
                    finding.push(findByName(parts[0], '', parts[1]).then(id => {officer.personId = id;}));
                }
                else {
                    console.log(officer.name);
                }
                */

            });

            return Promise.all(finding).then(processNextInit);
        }


        // save!
        let index = 0;

        function saveNext() {

            if (index === initiations.length) return Promise.resolve();

            if (index % 1000 === 0) console.log("update init " + index);

            let init = initiations[index++];
            return initiation.save(init).then(saveNext);
        }

        return processNextInit().then(database.beginTransaction).then(saveNext).then(database.commit);
    });

    function findPerson(first, middle, last) {
        // trim the names
        first = trim(first);
        middle = trim(middle);
        last = trim(last);

        middle = middle.replace(/[^0-9a-z\s]/gi, ' ').toLowerCase();
        while (middle.match(/\s\s/)) { middle = middle.replace(/\s\s/g, ' '); } // remove double space

        let key1 = first + " " + last;
        let person = findPersonByKey(key1);

        // multiples found, try to find by middle
        if (Array.isArray(person)) {

            // no middle to filter by, just return them all
            if (middle === null || middle.length === 0) return person;

            // first by initial
            let a = [];
            person.forEach(p => {
                if (p.middleName[0] === middle[0]) a.push(p);
            });

            if (a.length === 0) return person;
            if (a.length === 1) return a[0];

            // more than one initial match, try to match whole name
            let b = [];
            person.forEach(p => {
                if (p.middleName === middle) b.push(p);
            });

            if (b.length === 0) return person;
            if (b.length === 1) return b[0];
        }

        return person;
    }

    function findPersonByKey(key) {
        if (!personLookup.hasOwnProperty(key)) return null;
        return personLookup[key];
    }

};

//database.init(database.storageType.file).then(exports.execute);





