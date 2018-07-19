'use strict';

const fs = require('fs');
let database = require('../data2/database');
let initiation = require('../data2/initiation');
let location = require('../data2/location');

let locationCache = {};
let locationFix = {};

exports.execute = () => {

    // load the fixes
    let fixDataRaw = fs.readFileSync('./locations_fix.txt').toString();
    let fixData = fixDataRaw.replace(/\|/g, '\t').split('\n');
    fixData.forEach(line => {
        let a = line.split('\t');
        if (a.length > 2) {
            locationFix[a[1]] = a[2];
        }
    });

    return initiation.selectAll().then(initiations => {

        let index = 0;
        function next() {

            if (index === initiations.length) return Promise.resolve();

            let init = initiations[index++];

            return getLocationRecord(init.data.location)
                .then(id => {
                    init.data.performedAt_locationId = id === null ? null : id[0];
                    if (id !== null && id.length === 2) init.data.performedAt2_locationId = id[1];
                })
                /*
                // do we really care about membership?
                .then(() => {
                    return getLocationRecord(init.data.localBody)
                        .then(id => {
                            init.data.memberAt_locationId = id === null ? null : id[0];
                            if (id !== null && id.length === 2) init.data.memberAt2_locationId = id[1];
                        })
                })
                */

                .then(next);
        }

        return next();
    })
        .then(() => {
            let a = [];
            for (let key in locationCache) {
                a.push({key: key, count: locationCache[key].count});
            }

            a.sort((a, b) => {
                return a.key < b.key ? -1 : 1;
            });

            let lines = [];
            a.forEach(item => {
                lines.push([item.count, item.key].join('\t'));
            });

            fs.writeFileSync('locations.txt', lines.join('\n'));
        })
};


function getLocationRecord(name) {
    //let op = name;

    if (name === null || name.length === 0) return Promise.resolve(null);

    // name has a split
    if (name.indexOf('/') !== -1) {
        let both = name.split('/');
        return Promise.all([getLocationRecord(both[0].trim()), getLocationRecord(both[1].trim())]);
    }

    name = name.toLowerCase();
    name = name.replace(/[-.:]/g, ' ');
    name = name.replace(/[?]/g, '');
    name = name.replace(/\n/g, ' ');
    name = name.replace(/\r/g, ' ');
    name = name.replace(/[&+]/g, 'and');

    // determine type and remove
    let type = "";
    if (name.match(/(?:lodge|oasis|camp|encampment)/)) type = 'moe';
    else if (name.match(/(?:chapter|r\+c|rose croix|rose coixr)/)) type = 'chapter';
    //else if (name.match(/temple/)) type = 'temple';
    else if (name.match(/consistory/)) type = 'consistory';
    else if (name.match(/senate/)) type = 'senate';

    name = name.replace(/(?:lodge|oasis|camp|encampment)/g, '');
    // |chapter|r\+c|rose croix|rose coixr|consistory|senate

    if (name.trim() === 'l v x') name = 'lvx';

    // remove double space
    while (name.match(/\s\s/)) {
        name = name.replace(/\s\s/g, ' ');
    }

    name = name.trim();

    // apply the fixes
    if (locationFix.hasOwnProperty(name)) name = locationFix[name];

    // look in the cache
    if (locationCache.hasOwnProperty(name)) {
        let record = locationCache[name];
        record.count++;
        return Promise.resolve([record.locationId]);
    }

    // otherwise we need to create
    let data = {
        name: name,
        type: type
    };

    let record = location.create({data: data});
    record.count = 1;
    locationCache[name] = record;

    return location.save(record).then(() => {
        return [record.locationId];
    });
    
}
