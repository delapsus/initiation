const Database = require('../database');

describe("Database", () => {

    test("db file", () => {
        expect(Database.dbPath).toBeDefined();
        expect(Database.storageType.file).toBe(Database.dbPath);
    });

    test("init from memory and close", async () => {
        await Database.init(Database.storageType.memory);
        await Database.close();
    });

    test("init from file and close", async () => {
        await Database.init(Database.storageType.file);
        await Database.close();
    });

});

