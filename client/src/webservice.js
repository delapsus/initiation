import {postAjax} from './http';

export function submitApplication(state) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/submit-application", {data:state}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export function submitMergePerson(masterPersonId, slavePersonId) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/merge-person", {masterPersonId:masterPersonId, slavePersonId:slavePersonId}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export function getPerson(personId) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/person", {personId: personId}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export function getLocation(locationId) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/location", {locationId: locationId}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export function getLocationWithData(locationId) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/location-with-data", {locationId: locationId}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export function getPersonWithData(personId) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/person-with-data", {personId: personId}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export function submitEditPerson(person) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/submit-edit-person", {person:person}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export function submitEditLocation(location) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/submit-edit-location", {location:location}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export function getInitiation(initiationId) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/initiation", {initiationId: initiationId}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}
