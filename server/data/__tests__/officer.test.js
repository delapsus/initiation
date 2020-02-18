const Officer = require('../officer');

describe("degree", () => {
    test("lookup", () => {
        expect(Officer.lookup[1].name).toBe("Initiator");
        expect(Officer.lookup[13].name).toBe("Grand Marshal");
        expect(Officer.lookup[14]).toBeUndefined();
    });
    test("values", () => {
        expect(Officer.values.length).toBe(13);
    });
});
