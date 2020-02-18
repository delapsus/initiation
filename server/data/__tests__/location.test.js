const Location = require('../location');
const Database = require('../database');

describe("location", () => {

    test(`create table- in memory insert and delete`, async () => {
        await Database.init(Database.storageType.memory);
        await Location.createTable();

        // insert record
        const data1 = {name:'Horizon', type:'moe', city:'Seattle', state:'WA'};
        const record1 = Location.create({data: data1});
        await Location.save(record1);

        // load record and verify
        const value = await Location.selectOne(record1.locationId);
        expect(value.locationId).toBe(1);
        expect(value.data).toBeDefined();

        // a second record
        const data2 = {name:'Leaping Laughter', type:'moe', city:'Minneapolis', state:'MN'};
        const record2 = Location.create({data: data2});
        await Location.save(record2);

        const all = await Location.selectAll();
        expect(all.length).toBe(2);

        // close db
        await Database.close();
    });

});
