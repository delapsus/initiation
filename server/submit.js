let Person = require('./data2/person');
let Initiation = require('./data2/initiation');
let dataCache = require('./people-search');

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
