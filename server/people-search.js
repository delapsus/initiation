let Person = require('./data/person');
let initiation = require('./data/initiation');
let degree = require('./data/degree');

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

function getAllPeopleWithInits() {
    return Promise.all([
        Person.selectAll(),
        initiation.selectAll(),
        degree.selectAll()
    ]).then(results => {
        let o = {
            people: results[0]
        };

        let peopleLookup = {};
        o.people.forEach(p => {
            peopleLookup[p.personId] = p;
            p.initiations = [];
        });

        let degreeLookup = {};
        results[2].forEach(d => {
            degreeLookup[d.degreeId] = d;
        });

        results[1].forEach(init => {
            peopleLookup[init.personId].initiations.push(init);
            init.degree = degreeLookup[init.degreeId];
        });

        o.people.forEach(p => {
            p.initiations.sort((a, b) => {
                if (a.degree.rank < b.degree.rank) return -1;
                else if (a.degree.rank > b.degree.rank) return 1;
                else return 0;
            });
        });

        return o.people;
    });
}

exports.getPeople = post => {

    let select = null;
    if (peopleCache === null) select = getAllPeopleWithInits().then(result => {
        result.sort(sortMethods.lastName);
        peopleCache = result;
        return peopleCache;
    });
    else select = Promise.resolve(peopleCache);

    return select.then(result => {

        if (post.textSearch && post.textSearch.length > 0) {
            let parts = post.textSearch.toLowerCase().split(' ');

            let matching = [];
            result.forEach(p => {
                let possible = [];
                if (p.firstName) possible.push(p.firstName.toLowerCase());
                if (p.lastName) possible.push(p.lastName.toLowerCase());

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
                if (allMatch) matching.push(p);
            });

            result = matching;

        }

        let value = {
            count: result.length,
            people: null
        };

        let pageSize = post.pageSize || 0;
        let index = post.index || 0;
        let start = pageSize * index;

        // outside the bounds
        if (result.length <= start) value.people = [];

        // page is completely within bounds
        else if (result.length >= start + pageSize) value.people = result.slice(start, start + pageSize);

        // just the end records
        else value.people = result.slice(start, result.length);

        return value;
    });



};

let cache = null;

function getPeopleCache() {
    if (cache !== null) return Promise.resolve(cache);

    return Person.selectAll().then(records => {

        records.forEach(person => {
            let a = [];
            if (person.firstName !== null) a.push(person.firstName.replace(reNonChar, ' '));
            if (person.middleName !== null) a.push(person.middleName.replace(reNonChar, ' '));
            if (person.lastName !== null) a.push(person.lastName.replace(reNonChar, ' '));
            person.searchName = a.join(' ').toLowerCase();
        });

        cache = records;
        return cache;
    });
}

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


