const Person = require('../person');
const Database = require('../database');

describe("person", () => {

    let record1 = null;
    let record2 = null;

    beforeAll(async () => {
        await Database.init(Database.storageType.memory);
    });

    afterAll(async () => {
        // close db
        await Database.close();
    });

    test('create table', async () => {
        await Person.createTable();
    });

    test('insert', async () => {
        // insert record
        const data1 = {firstName: 'Scott', lastName: 'Wilde', createdDate: new Date(), isMaster: true};
        record1 = Person.create({data: data1});
        await Person.save(record1);
        expect(record1.personId).toBe(1);

        // a second record
        let data2 = {firstName: 'Cate', lastName: 'Englehart', createdDate: new Date()};
        record2 = Person.create({data: data2});
        await Person.save(record2);
        expect(record2.personId).toBe(2);
    });

    test('load', async () => {
        // load record and verify
        const value = await Person.selectOne(record1.personId);
        expect(value.personId).toBe(1);
        expect(value.data).toBeDefined();
        expect(value.data.createdDate).toBeInstanceOf(Date);
    });

    test(`select all`, async () => {
        const all = await Person.selectAll();
        expect(all.length).toBe(2);
    });

});
