'use strict';

let database = require('../data2/database');
let initiation = require('../data2/initiation');
let location = require('../data2/location');

let locationCache = {};

exports.execute = () => {
    return initiation.selectAll().then(initiations => {

        let index = 0;
        function next() {

            if (index === initiations.length) return Promise.resolve();

            let init = initiations[index++];

            return getLocationRecord(init.data.localBody)
                .then(id => {
                    init.data.memberAt_locationId = id;
                })
                .then(() => {
                    return getLocationRecord(init.data.location)
                        .then(id => {
                            init.data.performedAt_locationId = id;
                        })
                })
                .then(next);
        }

        return next();
    });
};


function getLocationRecord(name) {
    //let op = name;

    if (name === null || name.length === 0) return Promise.resolve(null);
    
    name = name.toLowerCase();
    name = name.replace(/[-.]/g, ' ');
    name = name.replace(/[?]/g, '');
    name = name.replace(/&/g, 'and');

    // determine type and remove
    let type = "";
    if (name.match(/(?:lodge|oasis|camp|encampment)/)) type = 'moe';
    else if (name.match(/chapter/)) type = 'chapter';
    else if (name.match(/temple/)) type = 'temple';
    else if (name.match(/consistory/)) type = 'consistory';
    else if (name.match(/senate/)) type = 'senate';

    name = name.replace(/(?:lodge|oasis|camp|encampment|chapter|temple|consistory|senate)/g, '');

    if (name.trim() === 'l v x') name = 'lvx';

    // remove double space
    while (name.match(/\s\s/)) {
        name = name.replace(/\s\s/g, ' ');
    }

    // add the type back to non-moe
    if (type.length > 0 && type !== 'moe') {
        name += ' ' + type;
    }

    name = name.trim();
    if (locationCache.hasOwnProperty(name)) {
        let record = locationCache[name];
        return Promise.resolve(record.locationId);
    }

    // otherwise we need to create
    let data = {
        name: name,
        type: type
    };

    let record = location.create({data: data});
    locationCache[name] = record;

    return location.save(record).then(() => {
        return record.locationId;
    });
    
}
