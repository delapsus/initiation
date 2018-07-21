let Person = require('./data2/person');
let Initiation = require('./data2/initiation');
let degreeLookup = require('./data2/degree').lookup;

let sortMethods = {
    lastName: function(a, b) {
        let aVal = (a.lastName || "").toLowerCase();
        let bVal = (b.lastName || "").toLowerCase();

        if (aVal.length === 0 && bVal.length === 0) return 0;
        if (aVal.length > 0 && bVal.length === 0) return -1;
        if (aVal.length === 0 && bVal.length > 0) return 1;

        if (aVal < bVal) return -1;
        else if (aVal > bVal) return 1;
        else return 0;
    }
};

let peopleCache = null;

function loadAllPeopleWithInits() {
    return Promise.all([
        Person.selectAll(),
        Initiation.selectAll()
    ]).then(results => {

        let people = results[0];
        let initiations = results[1];

        // add the people to the lookup by id
        let peopleLookup = {};
        people.forEach(p => {
            peopleLookup[p.personId] = p;
            p.initiations = [];
        });

        // give the initiations to the people
        initiations.forEach(init => {
            peopleLookup[init.data.personId].initiations.push(init);
            init.degree = degreeLookup[init.data.degreeId]; // to allow sorting by rank
        });

        // sort each person's initiations
        people.forEach(person => {
            person.initiations.sort((a, b) => {
                if (a.degree.rank < b.degree.rank) return -1;
                else if (a.degree.rank > b.degree.rank) return 1;
                else return 0;
            });
        });

        // now calculate a searchName
        people.forEach(person => {
            let a = [];
            if (person.data.firstName !== null) a.push(person.data.firstName.replace(reNonChar, ' '));
            if (person.data.middleName !== null) a.push(person.data.middleName.replace(reNonChar, ' '));
            if (person.data.lastName !== null) a.push(person.data.lastName.replace(reNonChar, ' '));
            person.searchName = a.join(' ').toLowerCase();
        });

        // sort the people
        people.sort(sortMethods.lastName);

        return people;
    });
}

function getPeopleCache() {
    if (peopleCache === null) return loadAllPeopleWithInits().then(result => {
        peopleCache = result;
        return peopleCache;
    });
    return Promise.resolve(peopleCache);
}

exports.getPeople = post => {

    return getPeopleCache().then(people => {

        if (post.textSearch && post.textSearch.length > 0) {
            let parts = post.textSearch.toLowerCase().split(' ');

            let matching = [];
            people.forEach(person => {
                let possible = [];
                if (person.data.firstName) possible.push(person.data.firstName.toLowerCase());
                if (person.data.lastName) possible.push(person.data.lastName.toLowerCase());

                let allMatch = true;
                parts.forEach(part => {
                    let match = false;
                    for (let i = 0; i < possible.length; i++) {
                        if (possible[i] === null) continue;
                        if (possible[i].indexOf(part) !== -1) {
                            match = true;
                            possible[i] = null;
                            break;
                        }
                    }
                    if (!match) allMatch = false;
                });
                if (allMatch) matching.push(person);
            });

            people = matching;

        }

        let value = {
            count: people.length,
            people: null
        };

        let pageSize = post.pageSize || 0;
        let index = post.index || 0;
        let start = pageSize * index;

        // outside the bounds
        if (people.length <= start) value.people = [];

        // page is completely within bounds
        else if (people.length >= start + pageSize) value.people = people.slice(start, start + pageSize);

        // just the end records
        else value.people = people.slice(start, people.length);

        return value;
    });

};


let reNonChar = /[^a-zA-Z ]/g;

exports.suggestPeople = post => {

    let textSearch = post.textSearch.toLowerCase();

    textSearch = textSearch.replace(reNonChar, ' ');

    let tokens = textSearch.split(' ').map(text => {
        return new RegExp('(?:^|\\W)' + text, 'i');
    });

    return getPeopleCache().then(people => {

        let matches = people.filter(person => {

            let matchAll = true;

            for (let i = 0; i < tokens.length && matchAll; i++) {
                let found = person.searchName.match(tokens[i]);
                if (!found) matchAll = false;
            }

            return matchAll;
        });

        return matches.slice(0, 10);
    });
};


