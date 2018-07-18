function getLocationRecord(name) {
    let locationName = data.localBody || data.location || null;
    if (locationName !== null && locationName.length > 0) {

        locationName = locationName.toLowerCase();
        locationName = locationName.replace(/(?:lodge|oasis|camp|encampment|chapter|temple|consistory|senate)/g, '');
        locationName = locationName.replace(/[-.]/g, ' ');
        locationName = locationName.replace(/[?]/g, '');
        while (locationName.match(/\s\s/)) {
            locationName = locationName.replace(/\s\s/g, ' ');
        }
        locationName = locationName.trim();

        if (locationCache.hasOwnProperty(locationName)) {
            data.temp.location = locationCache[locationName];
        }
        else {
            let record = location.create({
                name: locationName
            });
            locationCache[locationName] = record;
            data.temp.location = record;

            locationSave.push(record);
        }
    }
}


let saveIndex = 0;
function saveNextLocation() {
    if (saveIndex === locationSave.length) return Promise.resolve();

    let record = locationSave[saveIndex++];
    return location.save(record).then(saveNextLocation);
}