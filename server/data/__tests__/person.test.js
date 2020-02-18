const Person = require('../person');
const Database = require('../database');

describe("person", () => {

    test(`create table- in memory insert and delete`, async () => {
        await Database.init(Database.storageType.memory);
        await Person.createTable();

        // insert record
        let data1 = {firstName: 'Scott', lastName: 'Wilde', createdDate: new Date(), isMaster: true};
        const record1 = Person.create({data: data1});
        await Person.save(record1);
        expect(record1.personId).toBe(1);

        // load record and verify
        const value = await Person.selectOne(record1.personId);
        expect(value.personId).toBe(1);
        expect(value.data).toBeDefined();
        expect(value.data.createdDate).toBeInstanceOf(Date);

        // a second record
        let data2 = {firstName: 'Cate', lastName: 'Englehart', createdDate: new Date()};
        const record2 = Person.create({data: data2});
        await Person.save(record2);
        expect(record2.personId).toBe(2);

        const all = await Person.selectAll();
        expect(all.length).toBe(2);

        // close db
        await Database.close();
    });

});
