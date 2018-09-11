let Person = require('./data2/person');
let Initiation = require('./data2/initiation');
let Location = require('./data2/location');
let Degree = require('./data2/degree');
let degreeLookup = Degree.lookup;
let officerLookup = require('./data2/officer').lookup;

let sortMethods = {
    lastName: function(a, b) {
        let aVal = (a.data.lastName || "").toLowerCase();
        let bVal = (b.data.lastName || "").toLowerCase();

        if (aVal.length === 0 && bVal.length === 0) return 0;
        if (aVal.length > 0 && bVal.length === 0) return -1;
        if (aVal.length === 0 && bVal.length > 0) return 1;

        if (aVal < bVal) return -1;
        else if (aVal > bVal) return 1;

        // then by first name
        aVal = (a.data.firstName || "").toLowerCase();
        bVal = (b.data.firstName || "").toLowerCase();

        if (aVal.length === 0 && bVal.length === 0) return 0;
        if (aVal.length > 0 && bVal.length === 0) return -1;
        if (aVal.length === 0 && bVal.length > 0) return 1;

        if (aVal < bVal) return -1;
        else if (aVal > bVal) return 1;

        return 0;
    },
    firstName: function(a, b) {
        let aVal = (a.data.firstName || "").toLowerCase();
        let bVal = (b.data.firstName || "").toLowerCase();

        if (aVal.length === 0 && bVal.length === 0) return 0;
        if (aVal.length > 0 && bVal.length === 0) return -1;
        if (aVal.length === 0 && bVal.length > 0) return 1;

        if (aVal < bVal) return -1;
        else if (aVal > bVal) return 1;
        else return 0;
    },
    byDateAsc: function(a, b) {
        let aVal = a.data.actualDate || a.data.proposedDate || a.data.signedDate || a.data.localBodyDate || null;
        let bVal = b.data.actualDate || b.data.proposedDate || b.data.signedDate || b.data.localBodyDate || null;

        if (aVal === null) {
            if (bVal === null) return 0;
            return 1;
        }
        else if (bVal === null) {
            return -1;
        }

        if (aVal < bVal) return -1;
        else if (aVal > bVal) return 1;
        else return 0;
    },
    byDateDesc: function(a, b) {
        let aVal = a.data.actualDate || a.data.proposedDate || a.data.signedDate || a.data.localBodyDate || null;
        let bVal = b.data.actualDate || b.data.proposedDate || b.data.signedDate || b.data.localBodyDate || null;

        if (aVal === null) {
            if (bVal === null) return 0;
            return 1;
        }
        else if (bVal === null) {
            return -1;
        }

        if (aVal > bVal) return -1;
        else if (aVal < bVal) return 1;
        else return 0;
    },
    byLastInitDateAsc: function(a, b) {

        if (a.initiations.length === 0) {
            if (b.initiations.length === 0) return 0;
            return 1;
        }
        else if (b.initiations.length === 0) {
            return -1;
        }

        let aInit = a.initiations[a.initiations.length-1];
        let bInit = b.initiations[b.initiations.length-1];

        let aVal = aInit.data.actualDate || aInit.data.proposedDate || aInit.data.signedDate || aInit.data.localBodyDate || null;
        let bVal = bInit.data.actualDate || bInit.data.proposedDate || bInit.data.signedDate || bInit.data.localBodyDate || null;

        if (aVal === null) {
            if (bVal === null) return 0;
            return 1;
        }
        else if (bVal === null) {
            return -1;
        }

        if (aVal < bVal) return -1;
        else if (aVal > bVal) return 1;
        else return 0;
    },
    byLastInitDateDesc: function(a, b) {

        if (a.initiations.length === 0) {
            if (b.initiations.length === 0) return 0;
            return 1;
        }
        else if (b.initiations.length === 0) {
            return -1;
        }

        let aInit = a.initiations[a.initiations.length-1];
        let bInit = b.initiations[b.initiations.length-1];

        let aVal = aInit.data.actualDate || aInit.data.proposedDate || aInit.data.signedDate || aInit.data.localBodyDate || null;
        let bVal = bInit.data.actualDate || bInit.data.proposedDate || bInit.data.signedDate || bInit.data.localBodyDate || null;

        if (aVal === null) {
            if (bVal === null) return 0;
            return 1;
        }
        else if (bVal === null) {
            return -1;
        }

        if (aVal > bVal) return -1;
        else if (aVal < bVal) return 1;
        else return 0;
    },
    bySponsoredCount: function(a, b) {
        let aVal = a.sponsoredInitiations.length;
        let bVal = b.sponsoredInitiations.length;

        if (aVal < bVal) return 1;
        else if (aVal > bVal) return -1;

        // then by officered
        aVal = a.officeredInitiations.length;
        bVal = b.officeredInitiations.length;

        if (aVal < bVal) return 1;
        else if (aVal > bVal) return -1;

        return 0;
    },
    byOfficeredCount: function(a, b) {
        let aVal = a.officeredInitiations.length;
        let bVal = b.officeredInitiations.length;

        if (aVal < bVal) return 1;
        else if (aVal > bVal) return -1;

        // then by sponsored
        aVal = a.sponsoredInitiations.length;
        bVal = b.sponsoredInitiations.length;

        if (aVal < bVal) return 1;
        else if (aVal > bVal) return -1;

        return 0;
    }
};



let cache = null;

exports.clearCache = () => {
    cache = null;
};

function loadCache() {
    if (cache === null) return Promise.all([loadAllPeopleWithInits(), loadLocations()])
        .then(result => {

            cache = {
                peopleList: result[0].peopleList,
                peopleLookup: result[0].peopleLookup,
                initiationList: result[0].initiationList,
                initiationLookup: result[0].initiationLookup,
                locations: result[1].locations,
                locationsLookup: result[1].locationsLookup
            };

            return cache;
        });
    return Promise.resolve(cache);
}

function loadAllPeopleWithInits() {
    return Promise.all([
        Person.selectAll(),
        Initiation.selectAll()
    ]).then(results => {

        let people = results[0].filter(person => {
            if (person.data.hasOwnProperty('archived') && person.data.archived) return false;
            return true;
        });

        // add the people to the lookup by id
        let lookup = {};
        people.forEach(p => {
            lookup[p.personId] = p;
            p.initiations = [];
            p.sponsoredInitiations = [];
            p.officeredInitiations = [];
        });

        let initiations = results[1];
        let initiationList = [];
        let initiationLookup = {};

        // give the initiations to the people
        initiations.forEach(init => {

            // this shouldn't happen, but lets capture it
            if (!init.data.hasOwnProperty('personId') || init.data.personId === null || !lookup.hasOwnProperty(init.data.personId)) {
                //console.log('initiation does not have valid personId: ' + init.initiationId);
                return;
            }

            // add the person's init list
            let person = lookup[init.data.personId.toString()];
            person.initiations.push(init);

            // add the degree
            addDegree(init);

            // invert initiation/person and store as initiation
            let o = copy(init);
            o.degree = init.degree;
            o.person = copy(person);
            initiationList.push(o);
            initiationLookup[o.initiationId] = o;

            // give this init to the sponsors
            let sponsor1 = lookup[o.data.sponsor1_personId];
            if (sponsor1) {
                sponsor1.sponsoredInitiations.push(o);
            }
            let sponsor2 = lookup[o.data.sponsor2_personId];
            if (sponsor2) {
                sponsor2.sponsoredInitiations.push(o);
            }

            // give the init to the officers
            o.data.officers.forEach(officer => {
                if (officer.personId) {
                    let p = lookup[officer.personId];
                    p.officeredInitiations.push(o);
                }
            });

        });

        // sort each person's initiations
        people.forEach(person => {
            person.initiations.sort((a, b) => {
                if (a.degree.rank < b.degree.rank) return -1;
                else if (a.degree.rank > b.degree.rank) return 1;
                else return 0;
            });
            person.sponsoredInitiations.sort(sortMethods.byDateAsc);
            person.officeredInitiations.sort(sortMethods.byDateAsc);
        });

        // now calculate a searchName
        let reNonChar = /[^a-zA-Z ]/g;
        people.forEach(person => {
            let a = [];
            if (person.data.firstName !== null) a.push(person.data.firstName.replace(reNonChar, ' '));
            if (person.data.middleName !== null) a.push(person.data.middleName.replace(reNonChar, ' '));
            if (person.data.lastName !== null) a.push(person.data.lastName.replace(reNonChar, ' '));
            person.searchName = a.join(' ').toLowerCase();
        });

        // sort the people
        people.sort(sortMethods.lastName);





        return { peopleList:people, peopleLookup: lookup, initiationList: initiationList, initiationLookup: initiationLookup };
    });
}



function loadLocations() {

    return Location.selectAll().then(result => {
        let locations = result;

        let locationsLookup = {};
        locations.forEach(loc => {
            locationsLookup[loc.locationId.toString()] = loc;
        });

        return {locations: locations, locationsLookup: locationsLookup};
    });
}

// *** lookup and add functions, only work when cache is loaded
function luPerson(personId) {
    if (typeof personId === 'undefined' || personId === null) return null;
    let key = personId.toString();
    return cache.peopleLookup[key];
}
function luLocation(locationId) {
    if (typeof locationId === 'undefined' || locationId === null) return null;
    let key = locationId.toString();
    return cache.locationsLookup[key];
}

function addLocation(init) {
    init.location = luLocation(init.data.performedAt_locationId);
    if (init.location !== null) init.location = copy(init.location);
}

function addSponsors(init) {
    let val1 = luPerson(init.data.sponsor1_personId);
    init.sponsor1_person = (val1 !== null) ? copy(val1) : null;

    let val2 = luPerson(init.data.sponsor2_personId);
    init.sponsor2_person = (val2 !== null) ? copy(val2) : null;
}
function addOfficers(init) {
    init.data.officers.forEach(o => {
        let val = luPerson(o.personId);
        o.person = (val === null) ? null : copy(val);
        o.officer = officerLookup[o.officerId];
    });
}
function addDegree(init) {
    if (!degreeLookup.hasOwnProperty(init.data.degreeId)) {
        init.degree = Degree.unknown;
    }
    else {
        init.degree = degreeLookup[init.data.degreeId]; // to allow sorting by rank
    }
}








// people search page, assumes one input
exports.getPeople = post => {

    return loadCache().then(cache => {
        let people = cache.peopleList;

        if (post.degreeId && post.degreeId !== 0) {
            people = people.filter(person => {

                if (post.degreeId === -1) {
                    return person.initiations.length === 0;
                }

                if (person.initiations.length === 0) return false;
                return person.initiations[person.initiations.length - 1].data.degreeId === post.degreeId;
            });
        }

        if (post.textSearch && post.textSearch.length > 0) {
            let text = post.textSearch.toLowerCase();
            //while (text.indexOf('  ') !== -1) {
            //    text = text.replace(/\s\s/g, ' ');
            //}
            let parts = text.split(' ');

            let matching = [];
            people.forEach(person => {
                let possible = [];
                if (person.data.firstName) possible.push(person.data.firstName.toLowerCase());
                //if (person.data.middleName) possible.push(person.data.middleName.toLowerCase());
                if (person.data.lastName) possible.push(person.data.lastName.toLowerCase());

                let allMatch = true;
                parts.forEach(part => {

                    if (part.length === 0) return;

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

        // sort the people
        switch (post.sortBy) {
            case 'lastName': people.sort(sortMethods.lastName); break;
            case 'firstName': people.sort(sortMethods.firstName); break;
            case 'lastDateAsc': people.sort(sortMethods.byLastInitDateAsc); break;
            case 'lastDateDesc': people.sort(sortMethods.byLastInitDateDesc); break;
            case 'sponsored': people.sort(sortMethods.bySponsoredCount); break;
            case 'officered': people.sort(sortMethods.byOfficeredCount); break;
        }

        return {
            count: people.length,
            people: paginate(people, post)
        };

    });

};

function paginate(array, post) {
    // page it down to size
    let pageSize = post.pageSize || 0;
    let index = post.index || 0;
    let start = pageSize * index;

    // outside the bounds
    if (array.length <= start) return [];

    // page is completely within bounds
    else if (array.length >= start + pageSize) return array.slice(start, start + pageSize);

    // just the end records
    else return array.slice(start, array.length);
}

exports.getPerson = function(personId) {

    return loadCache().then(cache => {
        let person = copy(cache.peopleLookup[personId]);

        // make sure to clear the extra data
        person.initiations = null;
        person.sponsoredInitiations = null;

        return person;
    });

};

exports.getPersonWithFullData = function(personId) {

    return loadCache().then(cache => {
        let original = cache.peopleLookup[personId];
        let person = copy(original);

        // attach initiations and officers
        person.initiations = [];
        original.initiations.forEach(initiation => {
            let init = copy(initiation);
            person.initiations.push(init);
            addSponsors(init);
            addLocation(init);
            addDegree(init);
        });

        // attach the people this person has sponsored
        person.sponsoredInitiations = [];
        original.sponsoredInitiations.forEach(initiation => {
            let i = copy(initiation);
            i.person = copy(initiation.person);
            addSponsors(i);
            addLocation(i);
            person.sponsoredInitiations.push(i);
        });

        // attach the initiations this person was an officer for
        person.officeredInitiations = [];
        original.officeredInitiations.forEach(initiation => {
            let i = copy(initiation);
            i.person = copy(initiation.person);
            //addSponsors(i);
            addLocation(i);
            person.officeredInitiations.push(i);
        });

        return person;
    });

};

exports.getLocation = function(locationId) {
    return loadCache().then(cache => {
        let location = copy(cache.locationsLookup[locationId]);

        // attach the people this person has sponsored
        location.initiationsPerformed = null;

        return location;
    });
};

//pageSize:10, index: 0, textSearch: state.textSearch
exports.getLocations = function(post) {
    return loadCache().then(cache => {

        let locations = cache.locations.slice(0);


        if (post.textSearch && post.textSearch.length > 0) {
            let text = post.textSearch.toLowerCase();

            let parts = text.split(' ');

            let matching = [];
            locations.forEach(location => {
                let possible = [];
                if (location.data.name) possible.push(location.data.name.toLowerCase());


                let allMatch = true;
                parts.forEach(part => {

                    if (part.length === 0) return;

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
                if (allMatch) matching.push(location);
            });

            locations = matching;
        }




        locations.sort((a,b) => {
            if (a.data.name < b.data.name) return -1;
            if (a.data.name > b.data.name) return 1;
            return 0;
        });

        if (post && post !== null) {
            locations = paginate(locations, post);
        }

        return {
            locations: locations
        };
    });
};

exports.getLocationWithInitiations = function(locationId) {
    return loadCache().then(cache => {
        let location = copy(cache.locationsLookup[locationId]);

        // attach the people this person has sponsored
        location.initiationsPerformed = [];
        cache.peopleList.forEach(p => {
            p.initiations.forEach(init => {
                if (init.data.performedAt_locationId === locationId) {
                    let i = copy(init);
                    i.person = copy(p);
                    addSponsors(i);
                    location.initiationsPerformed.push(i);
                }
            });
        });

        location.initiationsPerformed.sort(sortMethods.byDateAsc);

        return location;
    });
};

exports.getInitiationWithData = function(initiationId) {
    return loadCache().then(cache => {
        // first we need to find it, should eventually create this as a lookup
        let original = cache.initiationLookup[initiationId];

        let initiation = copy(original);

        initiation.degree = original.degree;
        initiation.person = original.person;
        addSponsors(initiation);
        addLocation(initiation);
        addOfficers(initiation);

        // add people initiated into same degree on the same day at same place

        initiation.otherPeople = [];

        if (initiation.data.actualDate !== null) {
            let actualDate = new Date(initiation.data.actualDate);

            cache.peopleList.forEach(p => {
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

exports.getInitiations = (post) => {
    return loadCache().then(cache => {

        // start with the full list
        let initiations = cache.initiationList;

        // filter by degree
        if (post.degreeId && post.degreeId !== 0) {
            initiations = initiations.filter(init => {

                if (post.degreeId === -1) {
                    return init.data.degreeId === null;
                }

                return init.data.degreeId === post.degreeId;
            });
        }

        if (post.status && post.status.length > 0) {
            initiations = initiations.filter(init => {

                let key1 = "certReceivedDate";
                let key2 = "certSentOutForSignatureDate";
                let key3 = "certSentOutToBodyDate";

                if (post.status === 'waitingForCert') {
                    if (init.data.hasOwnProperty(key3) && init.data[key3] !== null) return false;
                    if (init.data.hasOwnProperty(key2) && init.data[key2] !== null) return false;
                    if (init.data.hasOwnProperty(key1) && init.data[key1] !== null) return false;
                }

                else if (post.status === 'receivedCertFromBody') {
                    if (init.data.hasOwnProperty(key3) && init.data[key3] !== null) return false; // cant yet have sent to body
                    if (init.data.hasOwnProperty(key2) && init.data[key2] !== null) return false; // cant yet have sent for sig

                    if (!init.data.hasOwnProperty(key1) || init.data[key1] === null) return false; // needs to have received cert
                }

                else if (post.status === 'sentForSig') {
                    if (init.data.hasOwnProperty(key3) && init.data[key3] !== null) return false; // cant yet have sent to body

                    if (!init.data.hasOwnProperty(key2) || init.data[key2] === null) return false; // needs to have this value
                }
                else if (post.status === 'certSentToBody') {
                    if (!init.data.hasOwnProperty(key3) || init.data[key3] === null) return false; // needs to have this value
                }

                return true;
            });
        }

        // SORT
        if (post.sort === 'actualDateDesc') {
            initiations.sort(sortMethods.byDateDesc);
        }
        else if (post.sort === 'actualDateAsc') {
            initiations.sort(sortMethods.byDateAsc);
        }

        let value = {
            count: initiations.length,
            initiations: null
        };

        let pageSize = post.pageSize || 0;
        let index = post.index || 0;
        let start = pageSize * index;

        // outside the bounds
        if (initiations.length <= start) value.initiations = [];

        // page is completely within bounds
        else if (initiations.length >= start + pageSize) value.initiations = initiations.slice(start, start + pageSize);

        // just the end records
        else value.initiations = initiations.slice(start, initiations.length);

        return value;
    });
};

let reId = /id/i;

function copy(a) {

    let copy = {};
    for (let key in a) {
        if (key === 'data') copy.data = JSON.parse(JSON.stringify(a.data));
        else if (key.match(reId)) copy[key] = a[key];
    }

    return copy;
}