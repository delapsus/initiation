let Person = require('./data2/person');
let Initiation = require('./data2/initiation');
let Location = require('./data2/location');
let degreeLookup = require('./data2/degree').lookup;
let officerLookup = require('./data2/officer').lookup;

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



function loadAllPeopleWithInits() {
    return Promise.all([
        Person.selectAll(),
        Initiation.selectAll()
    ]).then(results => {

        let people = results[0];
        let initiations = results[1];

        // add the people to the lookup by id
        let lookup = {};
        people.forEach(p => {
            lookup[p.personId] = p;
            p.initiations = [];
        });

        // give the initiations to the people
        initiations.forEach(init => {
            lookup[init.data.personId].initiations.push(init);
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

        return { peopleList:people, peopleLookup: lookup };
    });
}

let peopleList = null;
let peopleLookup = null;

function getPeopleList() {
    if (peopleList === null) return loadAllPeopleWithInits().then(result => {
        peopleList = result.peopleList;
        peopleLookup = result.peopleLookup;
        return peopleList;
    });
    return Promise.resolve(peopleList);
}

function getPeopleLookup() {
    if (peopleLookup === null) return loadAllPeopleWithInits().then(result => {
        peopleList = result.peopleList;
        peopleLookup = result.peopleLookup;
        return peopleLookup;
    });
    return Promise.resolve(peopleLookup);
}

exports.getPeople = post => {

    return getPeopleList().then(people => {

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


let locations = null;
let locationsLookup = null;

function getLocations() {
    if (locations !== null) return Promise.resolve(locations);

    return Location.selectAll().then(result => {
        locations = result;

        locationsLookup = {};
        locations.forEach(loc => {
            locationsLookup[loc.locationId.toString()] = loc;
        });

        return locations;
    });
}


let reNonChar = /[^a-zA-Z ]/g;

exports.suggestPeople = post => {

    let textSearch = post.textSearch.toLowerCase();

    textSearch = textSearch.replace(reNonChar, ' ');

    let tokens = textSearch.split(' ').map(text => {
        return new RegExp('(?:^|\\W)' + text, 'i');
    });

    return getPeopleList().then(people => {

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

function luPerson(personId) {
    if (typeof personId === 'undefined' || personId === null) return null;
    let key = personId.toString();
    return peopleLookup[key];
}
function luLocation(locationId) {
    if (typeof locationId === 'undefined' || locationId === null) return null;
    let key = locationId.toString();
    return locationsLookup[key];
}

function addLocation(init) {
    init.location = luLocation(init.data.performedAt_locationId);
}
function addPerson(init) {
    init.person = luPerson(init.data.personId);
}
function addSponsors(init) {
    init.sponsor1_person = luPerson(init.data.sponsor1_personId);
    init.sponsor2_person = luPerson(init.data.sponsor2_personId);
}

function addOfficers(init) {
    init.data.officers.forEach(o => {
        o.person = luPerson(o.personId);
        o.officer = officerLookup[o.officerId];
    });
}

exports.getPersonWithFullData = function(personId) {

    return Promise.all([getPeopleLookup(), getLocations()]).then(() => {
        let person = copy(peopleLookup[personId]);

        // attach initiations and officers
        person.initiations.forEach(init => {
            addSponsors(init);
            addLocation(init);
        });

        // attach the people this person has sponsored
        person.sponsoredInitiations = [];
        peopleList.forEach(p => {
            p.initiations.forEach(init => {
                if (init.data.sponsor1_personId === personId) {
                    let i = copy(init);
                    i.person = copy(p);
                    addSponsors(init);
                    addLocation(init);
                    person.sponsoredInitiations.push(i);
                }
                if (init.data.sponsor2_personId === personId) {
                    let i = copy(init);
                    i.person = copy(p);
                    addSponsors(init);
                    addLocation(init);
                    person.sponsoredInitiations.push(i);
                }
            });
        });

        person.sponsoredInitiations.sort((a, b) => {
            let aVal = a.data.actualDate || a.data.proposedDate || a.data.signedDate || a.data.localBodyDate;
            let bVal = b.data.actualDate || b.data.proposedDate || b.data.signedDate || b.data.localBodyDate;
            if (aVal < bVal) return -1;
            else if (aVal > bVal) return 1;
            else return 0;
        });

        return person;
    });

};

exports.getLocationWithInitiations = function(locationId) {
    return Promise.all([getPeopleLookup(), getLocations()]).then(() => {
        let location = copy(locationsLookup[locationId]);

        // attach the people this person has sponsored
        location.initiationsPerformed = [];
        peopleList.forEach(p => {
            p.initiations.forEach(init => {
                if (init.data.performedAt_locationId === locationId) {
                    let i = copy(init);
                    i.person = copy(p);
                    addSponsors(i);
                    location.initiationsPerformed.push(i);
                }
            });
        });

        location.initiationsPerformed.sort((a, b) => {
            let aVal = a.data.actualDate || a.data.proposedDate || a.data.signedDate || a.data.localBodyDate;
            let bVal = b.data.actualDate || b.data.proposedDate || b.data.signedDate || b.data.localBodyDate;
            if (aVal < bVal) return -1;
            else if (aVal > bVal) return 1;
            else return 0;
        });

        return location;
    });
};

exports.getInitiation = function(initiationId) {
    return Promise.all([getPeopleLookup(), getLocations()]).then(() => {
        // first we need to find it, should eventually create this as a lookup
        let initiation = copy(getInitiation(initiationId));

        addPerson(initiation);
        addSponsors(initiation);
        addLocation(initiation);
        addOfficers(initiation);

        // add people initiated into same degree on the same day at same place

        initiation.otherPeople = [];

        if (initiation.data.actualDate !== null) {
            let actualDate = new Date(initiation.data.actualDate);

            peopleList.forEach(p => {
                p.initiations.forEach(init => {
                    // make sure they took place at same place and same degree
                    if (init.data.performedAt_locationId === initiation.data.performedAt_locationId && init.data.degreeId === initiation.data.degreeId && init.data.personId !== initiation.data.personId) {

                        // compare the dates
                        if (Math.abs(init.data.actualDate - actualDate) < 24*60*60*1000) {
                            initiation.otherPeople.push(p);
                        }

                    }
                });
            });
        }

        return Promise.resolve(initiation);
    });
};

function getInitiation(initiationId) {
    for (let i = 0; i < peopleList.length; i++) {
        let p = peopleList[i];
        for (let j = 0; j < p.initiations.length; j++) {
            if (p.initiations[j].initiationId === initiationId) {
                return p.initiations[j];
            }
        }
    }
    return null;
}

function copy(a) {
    let val = JSON.stringify(a);
    return JSON.parse(val);
}