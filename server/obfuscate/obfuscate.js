const fs = require('fs');
const Database = require('../data/database');
const Person = require('../data/person');
const Initiation = require('../data/initiation');

const firstNames = fs.readFileSync('./first-names.txt').toString().split('\r\n');
const lastNames = fs.readFileSync('./last-names.txt').toString().split('\r\n').map(name => {
    const a = [];
    for (let i = 0; i < name.length; i++) {
        let c = name.charCodeAt(i);
        if (c === 13) continue;
        if (i > 0) c += 32;
        a.push(c);
    }
    return String.fromCharCode(...a);
});

const dataFieldsPerson = require('./person-fields.json');
const dataFieldMapPerson = new Map();
dataFieldsPerson.forEach(field => {
    dataFieldMapPerson.set(field.name, field);
});

const dataFieldsInit = require('./initiation-fields.json');
const dataFieldMapInit = new Map();
dataFieldsInit.forEach(field => {
    dataFieldMapInit.set(field.name, field);
});

async function main() {
    await Database.init(Database.storageType.file);
    await obfuscateAllPersonRecords();
    await obfuscateAllInitiationRecords();
}

async function obfuscateAllInitiationRecords() {

    const all = await Initiation.selectAll();
    for (let i = 0; i < all.length; i++) {
        const initiation = all[i];
        obfuscateRecord(initiation, dataFieldMapInit);
        //await Initiation.save(initiation);
    }

    console.log(all.length);
}


async function obfuscateAllPersonRecords() {

    //const person = await Person.selectOne('1');
    //obfuscatePerson(person);
    //await Person.save(person);

    const all = await Person.selectAll();
    for (let i = 0; i < all.length; i++) {
        const person = all[i];
        obfuscateRecord(person, dataFieldMapPerson);
        //await Person.save(person);
    }

    console.log(all.length);
}

function obfuscateRecord(record, dataFieldMap) {
    //person.data.firstName = 'XXX';

    Object.keys(record.data).forEach(key => {
        // find unexpected keys
        if (!dataFieldMap.has(key)) {
            //console.log(`key found on person not in list: ${key}`);
            //return;
            throw new Error(`data key not in list: ${key}`);
        }

        const field = dataFieldMap.get(key);

        if (!field.obfuscate) return;

        const origValue = record.data[key];
        if (origValue === null || origValue === '') return;

        let value = null;
        switch (field.obfuscate) {
            case 'random':
                value = generateRandomString();
                break;

            case 'firstname':
                value = firstNames[Math.floor(Math.random() * firstNames.length)];
                break;
            case 'middlename':
                value = firstNames[Math.floor(Math.random() * firstNames.length)];
                break;
            case 'lastname':
                value = lastNames[Math.floor(Math.random() * lastNames.length)];
                break;
            case 'fullname':
                value = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
                break;
            case 'motto':
                value = generateRandomString();
                break;
            case 'zip':
                value = generateRandomDigits(5);
                break;
            case 'phone':
                value = `${generateRandomDigits(3)}-${generateRandomDigits(3)}-${generateRandomDigits(4)}`
                break;
            case 'email':
                value = `${generateRandomString()}@fake.oto-usa.org`;
                break;
            case 'onepercent':
                value = Math.random() <= 0.01 ? true : false;
                break;
            case 'officers':
                value = [];
                for (let i = 0; i < origValue.length; i++) {
                    const o = origValue[i];
                    console.log(o);
                    if (o.name && o.name.length > 0) o.name = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
                    value.push(o);
                }

                break;
            default:
                throw new Error(`unhandled obfuscate type: ${field.obfuscate}`);
        }

        record.data[key] = value;
    });

}

const aUpper = 'A'.charCodeAt(0);
const aLower = 'a'.charCodeAt(0);

function getRandomCharCode(isUppercase = false) {
    const start = isUppercase ? aUpper : aLower;
    const offset = Math.floor(Math.random() * 26);
    return start + offset;
}

function generateRandomString(minSize = 3, maxSize = 8, capitalized = true) {
    let a = [];
    const length = Math.floor(Math.random() * (maxSize - minSize) + minSize);
    for (let i = 0; i < length; i++) {
        const isUppercase = i === 0 && capitalized;
        a.push(getRandomCharCode(isUppercase))
    }
    return String.fromCharCode(...a);
}

function generateRandomDigits(count) {
    let a = [];
    for (let i = 0; i < count; i++) {
        a.push(Math.floor(Math.random() * 10));
    }
    return a.join('');
}



(async () => {
    await main();
})();

