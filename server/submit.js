let Person = require('./data2/person');
let Initiation = require('./data2/initiation');
let dataCache = require('./data-cache');

exports.submitApplication = function(post) {

    let saving = [];

    // First create the people if needed
    if (post.data.personId === -1) {
        let person = Person.create({data:{
                firstName: post.data.person.firstName,
                middleName: post.data.person.middleName,
                lastName: post.data.person.lastName
            }});

        saving.push(Person.save(person).then(() => {
            post.data.personId = person.personId;
            console.log('person created from initiation: ' + person.personId);
        }));
    }
    else {
        // update the address if need be
    }

    if (post.data.sponsor1_personId === -1) {

        let person = Person.create({data:{
            firstName: post.data.sponsor1.firstName,
            middleName: post.data.sponsor1.middleName,
            lastName: post.data.sponsor1.lastName
        }});

        saving.push(Person.save(person).then(() => {
            post.data.sponsor1_personId = person.personId;
            console.log('person created as sponsor: ' + person.personId);
        }));
    }

    if (post.data.sponsor2_personId === -1) {
        let person = Person.create({data:{
                firstName: post.data.sponsor2.firstName,
                middleName: post.data.sponsor2.middleName,
                lastName: post.data.sponsor2.lastName
            }});

        saving.push(Person.save(person).then(() => {
            post.data.sponsor2_personId = person.personId;
            console.log('person created as sponsor: ' + person.personId);
        }));
    }

    // wait for any saving person records
    return Promise.all(saving).then(() => {
        // then save the initiation

        let init = Initiation.create({data:{
                personId: post.data.personId,
                degreeId: post.data.degreeId,
                locationId: post.data.locationId,
                sponsor1_personId: post.data.sponsor1_personId,
                sponsor2_personId: post.data.sponsor2_personId,

                localBody: post.data.bodyMembership,
                signedDate: post.data.signedDate,
                proposedDate: post.data.proposedDate
            }});

        return Initiation.save(init).then(() => {
            dataCache.clearCache();
            console.log('initiation saved ' + init.initiationId);
            return init;
        });
    });


};

exports.submitEditPerson = function(post) {
    return Person.save(post.person)
        .then(dataCache.clearCache)
        .then(() => {return {};});
};

exports.mergePerson = function(masterPersonId, slavePersonId) {

    return dataCache.getPersonWithFullData(slavePersonId).then(slave => {
        // first load up each initiation to check
        let toSave = {};

        // direct initiations
        slave.initiations.forEach(init => {
            toSave[init.initiationId] = init;
        });

        // sponsored initiations
        slave.sponsoredInitiations.forEach(init => {
            toSave[init.initiationId] = init;
        });

        // officered initiations
        slave.officeredInitiations.forEach(init => {
            toSave[init.initiationId] = init;
        });

        // then go through and change any applicable IDs and save
        let saving = [];
        for (let key in toSave) {
            let init = toSave[key];

            if (init.data.personId === slavePersonId) init.data.personId = masterPersonId;
            if (init.data.sponsor1_personId === slavePersonId) init.data.sponsor1_personId = masterPersonId;
            if (init.data.sponsor2_personId === slavePersonId) init.data.sponsor2_personId = masterPersonId;
            init.data.officers.forEach(officer => {
                if (officer.personId === slavePersonId) officer.personId = masterPersonId;
            });

            saving.push(Initiation.save(init));
        }

        return Promise.all(saving)
            .then(() => {
                slave.data.archived = true;
                return Person.save(slave);
            })
            .then(() => {
                // eventually do this
                dataCache.clearCache();
                return {};
            });
    });



};
