'use strict';

let fs = require('fs');
let database = require('../data/database');
let Person = require('../data/person');
let initiation = require('../data/initiation');

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
    officersDupe: 0,
    officersAdded: 0
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

    // expects raw name
    // tries to find existing record from lookup
    // if not found, will add a new record to database and lookup
    function findOrAddByFullNameString(name) {

        // first clean the name of all but alpha numeric, dash is also allowed
        let key = name.replace(/[^0-9a-z\s-]/gi, '').toLowerCase();
        while (key.match(/\s\s/)) { key = key.replace(/\s\s/g, ' '); } // remove double space
        key = key.trim();

        // some cleanup
        key = key.replace('syntaxiss 370 ', '');
        key = key.replace('i i i', 'iii');
        key = key.replace(' iii', '');
        key = key.replace(/^t /, '');
        key = key.replace(/\n/, ' ');
        key = key.replace(/\r/, ' ');
        key = key.replace(/^m dion/, 'matthew dion');
        key = key.replace(/^le roy/, 'leroy');
        key = key.replace(/ - /, '-');
        key = key.replace(/- /, '-');
        key = key.replace(/^fra /, '');
        key = key.replace(/^dr /, '');
        key = key.replace(/ jr$/, '');
        key = key.replace(/ sr$/, '');
        key = key.replace(/^2nd /, '');
        key = key.replace(/^3rd /, '');
        key = key.replace(/^asst /, '');
        key = key.replace(/m dioysos rogers/, 'matthew dionysos rogers');
        key = key.replace(/matthew dionysius rogers/, 'matthew dionysos rogers');
        key = key.replace(/matt dionysos rogers/, 'matthew dionysos rogers');
        key = key.replace(/matt d rogers/, 'matthew dionysos rogers');
        key = key.replace(/matthew dionysus rogers/, 'matthew dionysos rogers');
        key = key.replace(/polyphylus/, 'matthew dionysos rogers');
        key = key.replace(/d rogers/, 'matthew dionysos rogers');
        key = key.replace(/l page brunner/, 'linda page brunner');
        key = key.replace(/l p brunner/, 'linda page brunner');
        key = key.replace(/l pagebrunner/, 'linda page brunner');
        key = key.replace(/l page bruner/, 'linda page brunner');
        key = key.replace(/l page brunnner/, 'linda page brunner');
        key = key.replace(/l page kaczynski/, 'l page kacznski');
        key = key.replace(/l page kacznski/, 'linda page kacznski');
        key = key.replace(/john robin bohumil/, 'john douglas bohumil');
        key = key.replace(/jp lund/, 'j p lund');
        key = key.replace(/j p lund/, 'john peter lund');
        key = key.replace(/john peter lund/, 'john peter martin lund');
        key = key.replace(/cs hyatt/, 'c s hyatt');
        key = key.replace(/c s hyatt/, 'christopher s hyatt');
        key = key.replace(/m lisa faulkner/, 'marie lisa faulkner');
        key = key.replace(/suzanne fk torchia/, 'suzanne francoise kovacs torchia');
        key = key.replace(/suzanne f k torchia/, 'suzanne francoise kovacs torchia');
        key = key.replace(/suzanne francoise kovacs torchia/, 'suzanne francoise kovacs torchia');
        key = key.replace(/sangrovanni williams/, 'sangrovanni-williams');
        key = key.replace(/stephen saint john o day/, 'stephen saint john oday');
        key = key.replace(/stephen st john oday/, 'stephen saint john oday');
        key = key.replace(/steven saint john oday/, 'stephen saint john oday');
        key = key.replace(/stephen st john o day/, 'stephen saint john oday');
        key = key.replace(/jm nobles/, 'jim nobles');
        key = key.replace(/marlenecornelius/, 'marlene cornelius');
        key = key.replace(/roncelin v/, 'roncelin');
        key = key.replace(/roncelinii/, 'roncelin');
        key = key.replace(/thomascaldwell/, 'thomas caldwell');
        key = key.replace(/no emir listed/, '');
        key = key.replace(/s john baner/, 's john banner');
        key = key.replace(/jillbellanger/, 'jill bellanger');
        key = key.replace(/megansschulze/, 'megan s schulze');
        key = key.replace(/melissaholm/, 'melissa holm');
        key = key.replace(/augustlascola/, 'august lascola');
        key = key.replace(/emilylawson/, 'emily lawson');
        key = key.replace(/carlbrickner/, 'carl brickner');
        key = key.replace(/d o delodge/, 'dan de lage');
        key = key.replace(/^na$/, '');
        key = key.replace(/no signature doug james/, 'doug james');
        key = key.replace(/edwardlawson/, 'edward lawson');
        key = key.replace(/xx/, '');
        key = key.replace(/xx/, '');
        key = key.replace(/xx/, '');

        key = key.trim();

        if (key.length === 0) {
            return Promise.resolve(null);
        }

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
                status.officersFound++;
                return Promise.resolve(result.personId);
            }
        }

        // person not found, create a new record if possible
        else {



            // if just a first and last name, lets go ahead and create it
            let parts = key.split(' ');

            // special cases
            if (key === 'john peter martin lund') parts = ['john peter', 'martin', 'lund'];
            if (key === 'lon milo du quette') parts = ['lon', 'milo', 'du quette'];
            if (key === 'stephen saint john oday') parts = ['stephen', 'saint john', 'oday'];
            if (key === 'howard joseph john wuelfing') parts = ['howard', 'joseph john', 'wuelfing'];
            if (key === 'dan de lage') parts = ['dan', 'de lage'];
            if (key === 'leanne marie mason brooks') parts = ['leanne', 'marie mason', 'brooks'];
            if (key === 'constance du quette') parts = ['constance', 'du quette'];
            //if (key === '') parts = ['', '', ''];


            if (parts.length === 2) {
                if (parts[0].length > 2 && parts[1].length > 2) {
                    status.officersAdded++;
                    return findOrAddByName(parts[0], "", parts[1]);
                }
            }

            if (parts.length === 3) {
                if (parts[0].length > 2 && parts[2].length > 2) {
                    status.officersAdded++;
                    return findOrAddByName(parts[0], parts[1], parts[2]);
                }
            }

            // name can't be processed, log it
            if (officerCheck.hasOwnProperty(key)) officerCheck[key]++;
            else officerCheck[key] = 1;
            status.officersNotFound++;

        }

        return Promise.resolve(null);
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
    let officerCheck = {};

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

            if (initIndex === initiations.length) return Promise.resolve();

            let init = initiations[initIndex++];

            let finding = Promise.resolve();

            // find each sponsor, or add a person record if not found
            finding = finding.then(() => {
                return findOrAddByName(init.data.sponsor1First, init.data.sponsor1Middle, init.data.sponsor1Last).then(id => {
                    init.data.sponsor1_personId = id;
                });
            });
            finding = finding.then(() => {
                return findOrAddByName(init.data.sponsor2First, init.data.sponsor2Middle, init.data.sponsor2Last).then(id => {
                    init.data.sponsor2_personId = id;
                })
            });

            // officers don't have names split up, so this gets difficult
            init.data.officers.forEach(officer => {
                finding = finding.then(() => {
                    return findOrAddByFullNameString(officer.name).then(id => {officer.personId = id;})
                });
            });

            return finding.then(processNextInit);
        }


        // save!
        let index = 0;

        function saveNext() {

            if (index === initiations.length) return Promise.resolve();

            if (index % 1000 === 0) console.log("update init " + index);

            let init = initiations[index++];
            return initiation.save(init).then(saveNext);
        }

        return processNextInit()
            .then(() => {
                console.log('found: ' + status.found + ", not found: " + status.notFound + ", empty: " + status.empty + ", dupe (ignored): " + status.dupe);
                console.log("officersFound: " + status.officersFound + ", officersAdded: " + status.officersAdded + ", officersNotFound: " + status.officersNotFound + ", officersDupe: " + status.officersDupe);


                let a = [];
                for (let key in officerCheck) {
                    a.push({key: key, count: officerCheck[key]});
                }

                a.sort((a, b) => {
                    return a.count > b.count ? -1 : 1;
                });

                let lines = [];
                a.forEach(item => {
                    lines.push([item.count, item.key].join('\t'));
                });

                fs.writeFileSync('officersNotFound.txt', lines.join('\n'));
            })
            .then(database.beginTransaction).then(saveNext).then(database.commit);
    });

};






