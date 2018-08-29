import {postAjax} from './http';

export function submitApplication(state) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/submit-application", {data:state}, result => {
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

