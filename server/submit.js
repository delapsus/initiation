let Person = require('./data2/person');
let Initiation = require('./data2/initiation');
let Location = require('./data2/location');
let dataCache = require('./data-cache');

exports.submitApplication = function(post) {

    let saving = [];

    // create any locations if needed
    if (post.data.performedAt_locationId === -1) {
        let location = Person.create({data:{
                name: post.data.performedAt_location.name
            }});

        saving.push(Location.save(location).then(() => {
            post.data.performedAt_locationId = location.locationId;
            console.log('location created as performedAt: ' + location.locationId);
        }));
    }

    if (post.data.submittedThrough_locationId === -1) {
        let location = Person.create({data:{
                name: post.data.submittedThrough_location.name
            }});

        saving.push(Location.save(location).then(() => {
            post.data.submittedThrough_locationId = location.locationId;
            console.log('location created as submittedThrough: ' + location.locationId);
        }));
    }

    // wait for any saving person records
    return Promise.all(saving).then(() => {
        // then save the initiation

        let init = Initiation.create({data:post.data});

        return Initiation.save(init).then(() => {
            dataCache.clearCache();
            console.log('initiation saved ' + init.initiationId);
            return init;
        });
    });


};

exports.submitInitiationReport = function(post) {




    return Promise.resolve({});
};

exports.submitPersonPicker = async function(post) {
    let person = {data:post.person};
    await Person.save(person);
    dataCache.clearCache();
    return person.personId;
};

exports.submitLocationPicker = async function(post) {
    let location = {data:post.location};
    await Location.save(location);
    dataCache.clearCache();
    return location.locationId;
};


exports.submitEditPerson = function(post) {
    return Person.save(post.person)
        .then(dataCache.clearCache)
        .then(() => {return {};});
};

exports.submitEditLocation = function(post) {
    return Location.save(post.location)
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
