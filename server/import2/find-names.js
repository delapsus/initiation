'use strict';

let database = require('../data2/database');
let Person = require('../data2/person');
let initiation = require('../data2/initiation');

function trim(text) {
    return (text || "").toLowerCase().trim();
}

let counts = {
    empty: [],
    duplicate: []
};

let status = {
    found: 0,
    notFound: 0,
    empty: 0,
    dupe: 0,

    officersFound: 0,
    officersNotFound: 0,
    officersDupe: 0
};

exports.execute = () => {

    let personLookup;

    // read only - find person from personLookup by key
    function findPersonByKey(key) {
        if (!personLookup.hasOwnProperty(key)) return null;
        return personLookup[key];
    }

    // read only - find person from personLookup by first, middle, last
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

    // expects raw name
    // tries to find existing record from lookup
    // if not found, will add a new record to database and lookup
    function findOrAddByName(first, middle, last) {

        // ignore empty names
        if (trim(first).length === 0 && trim(last).length === 0) {
            status.empty++;
            return Promise.resolve(null);
        }

        // perform lookup
        let record = findPerson(first, middle, last);

        // something was found
        if (record !== null) {

            // too many records found, no way to resolve
            if (Array.isArray(record)) {
                status.dupe++;
                return Promise.resolve(null);
            }

            // record was found, return the id
            status.found++;
            return Promise.resolve(record.personId);
        }

        // no record found, create a new one
        status.notFound++;

        // create a new person entry
        let data = {firstName: first, middleName: middle, lastName: last, createdDate:new Date(), importSource: "sponsor"};
        record = Person.create({data: data});

        // save and return
        return Person.save(record).then(() => {
            // add the newly created record to the lookup
            addPersonToLookup(record);
            return record.personId;
        });
    }



    function addKeyToLookup(key, entry) {
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

    function addPersonToLookup(person) {

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

        // create the key
        let key1 = entry.firstName + " " + entry.lastName;
        addKeyToLookup(key1, entry);

        if (entry.middleName.length === 0) return;

        // add with middle initial
        let key2 = entry.firstName + " " + entry.middleName[0] + " " + entry.lastName;
        addKeyToLookup(key2, entry);

        if (entry.middleName.length === 1) return;

        // add with full middle
        let key3 = entry.firstName + " " + entry.middleName + " " + entry.lastName;
        addKeyToLookup(key3, entry);
    }



    // *** START THE PROCESS ***

    let persons, initiations;

    let loading = [
        Person.selectAll().then(result => {
            persons = result;

            // create lookup
            personLookup = {};
            persons.forEach(person => {
                addPersonToLookup(person);
            });

        }),
        initiation.selectAll().then(result => {
            initiations = result;
        })
    ];

    return Promise.all(loading).then(() => {
        console.log('data loaded, Persons: ' + persons.length + ", Initiations: " + initiations.length);
        console.log('records with empty names: ' + counts.empty.length + ", duplicate names on add: " + counts.duplicate.length);

        let initIndex = 0;

        function processNextInit() {

            if (initIndex === initiations.length) {
                console.log('found: ' + status.found + ", not found: " + status.notFound + ", empty: " + status.empty + ", dupe (ignored): " + status.dupe);
                console.log("officersFound: " + status.officersFound + ", officersNotFound: " + status.officersNotFound + ", officersDupe: " + status.officersDupe);
                return Promise.resolve();
            }

            let init = initiations[initIndex++];

            // find each sponsor, or add a person record if not found
            let finding = [
                // *** SPONSOR 1 ***
                findOrAddByName(init.data.sponsor1First, init.data.sponsor1Middle, init.data.sponsor1Last).then(id => {init.data.sponsor1_personId = id;}),
                // *** SPONSOR 2 ***
                findOrAddByName(init.data.sponsor2First, init.data.sponsor2Middle, init.data.sponsor2Last).then(id => {init.data.sponsor2_personId = id;})
                ];

            // *** OFFICERS ***
            // officers don't have names split up, so this gets difficult
            init.data.officers.forEach(officer => {

                // first clean the name of all but alpha numeric, dash is also allowed
                let key = officer.name.replace(/[^0-9a-z\s-]/gi, '').toLowerCase();
                while (key.match(/\s\s/)) { key = key.replace(/\s\s/g, ' '); } // remove double space
                key = key.trim();

                // then try to find by direct key
                let result = findPersonByKey(key);

                // something was found in the existing records
                if (result !== null) {
                    // too many records found, ignore
                    if (Array.isArray(result)) {
                        status.officersDupe++;
                    }
                    // only one record found, ideal
                    else {
                        officer.personId = result.personId;
                        status.officersFound++;
                    }
                }

                // person not found, create a new record if possible
                else {

                    status.officersNotFound++;

                    // if just a first and last name, lets go ahead and create it
                    let parts = key.split(' ');
                    if (parts.length === 2) {

                        if (parts[0].length > 2 && parts[1].length > 2) {
                            finding.push(findOrAddByName(parts[0], "", parts[1]).then(id => {officer.personId = id;}));
                        }

                    }

                    // too many parts, just log...
                    else {
                        console.log(key);
                    }
                }

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

};






