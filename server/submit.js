let Person = require('./data/person');
let Initiation = require('./data/initiation');
let Location = require('./data/location');
let dataCache = require('./data-cache');

let userFields = {
    all: [
        'previousName',
        'magicalName',
        'primaryAddress',
        'primaryCity',
        'primaryPrincipality',
        'primaryZip',
        'mailAddress',
        'mailCity',
        'mailPrincipality',
        'mailZip',
        'phone',
        'email',
        'bodyMembership',
        'healthConcerns',
        'unableToDrinkAlcohol',
        'medications',
        'allergies',
        'convictedOfFelony',
        'deniedInitiation'
    ],

    // minerval only fields
    1: [
        'profession',
        'birthDate',
        'birthTime',
        'birthCity',
        'birthPrincipality',
        'birthCountryMinerval'
    ],

    // first degree fields
    2: [
        'birthCountryFirst'
    ]
};



exports.submitApplication = async function(post) {

    // get the person record from the cache
    let person = await dataCache.getPersonWithFullData(post.data.personId);

    // overwrite certain fields
    userFields.all.forEach(key => {
        if (post.data.hasOwnProperty(key)) {
            person.data[key] = post.data[key];
        }
    });

    // also specific ones for this degree
    if (userFields.hasOwnProperty(post.data.degreeId)) {
        userFields[post.data.degreeId].forEach(key => {
            if (post.data.hasOwnProperty(key)) {
                person.data[key] = post.data[key];
            }
        });
    }

    // save the record
    await Person.save(person);


    // then save the initiation
    let init = Initiation.create({data:post.data});

    await Initiation.save(init);

    dataCache.clearCache();
    console.log('initiation saved ' + init.initiationId);
    return init;
};

exports.submitInitiationReport = async function(post) {

    let degreeId = post.data.degreeId;
    let candidates = post.data.candidates;

    let initiations = [];

    // first find the initiations
    await Promise.all(candidates.map(async o => {
        let person = await dataCache.getPersonWithFullData(o.personId);

        let initiation = person.initiations.find(init => {
            return init.data.degreeId === degreeId;
        }) || null;

        // if the person does not yet have the initiation, lets create it
        if (initiation === null) {
            initiation = Initiation.create({data:{
                    degreeId: degreeId,
                    personId: person.personId,
                    performedAt_locationId: post.data.performedAt_locationId
                }});

            await Initiation.save(initiation);
        }
        else {
            // overwrite the location
            initiation.data.performedAt_locationId = post.data.performedAt_locationId;
        }

        // indicate the cert has been received
        if (o.hasCertificate) initiation.data.certReceivedDate = new Date();

        initiations.push(initiation);
    }));

    // update the initiations
    let actualDate = new Date(post.data.initiationDate);
    let reportedDate = new Date(post.data.reportedDate);

    let officers = post.data.officers
        .filter(o => {return o.personId !== null})
        .map(o => { return {personId: o.personId, officerId: o.officerId}; });

    await Promise.all(initiations.map(async init => {
        init.data.actualDate = actualDate;
        init.data.reportedDate = reportedDate;
        init.data.officers = JSON.parse(JSON.stringify(officers));
        await Initiation.save(init);
    }));

    dataCache.clearCache();

    return {};
};

/*

    {name:'actualDate', type:'datetime'},
    {name:'reportedDate', type:'datetime'},
    {name:'certReceivedDate', type:'datetime'},

actualDate:2003-07-19
reportedDate:2003-08-28
Cert Received:2003-08-28

{
  "errors": [],
  "message": "",
  "degreeId": 2,
  "initiationDate",
  "reportedDate",
  "candidates": [
    {
      "personId": 4484
    },
    {
      "personId": 7954
    }
  ],
  "officers": [
    {
      "personId": 3197,
      "officerId": 1
    },
    {
      "personId": 9312,
      "officerId": 2
    },
    {
      "personId": 7543,
      "officerId": 3
    }
  ]
}
 */

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


exports.submitEditPerson = async function(post) {
    await Person.save(post.person);
    dataCache.clearCache();
    return {};
};

exports.submitEditInitiation = function(post) {
    return Initiation.save(post.initiation)
        .then(dataCache.clearCache)
        .then(() => {return {};});
};

exports.submitEditLocation = async function(post) {
    await Location.save(post.location);
    dataCache.clearCache();
    return {};
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
