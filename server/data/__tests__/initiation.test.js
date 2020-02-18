const Initiation = require('../initiation');
const Database = require('../database');

describe("initiation", () => {

    test(`create table- in memory insert and delete`, async () => {
        await Database.init(Database.storageType.memory);
        await Initiation.createTable();

        // insert record
        let data1 = {degreeId: 1, personId: 1, proposedDate: new Date('1/1/2017')};
        const record1 = Initiation.create({data: data1});
        await Initiation.save(record1);
        expect(record1.initiationId).toBe(1);

        // load record and verify
        const value = await Initiation.selectOne(record1.initiationId);
        expect(value.initiationId).toBe(1);
        expect(value.data).toBeDefined();
        expect(value.data.proposedDate).toBeInstanceOf(Date);

        // a second record
        let data2 = {degreeId: 2, personId: 1, proposedDate: new Date('1/1/2018')};
        const record2 = Initiation.create({data: data2});
        await Initiation.save(record2);
        expect(record2.initiationId).toBe(2);

        const all = await Initiation.selectAll();
        expect(all.length).toBe(2);

        // close db
        await Database.close();
    });

});
