const degree = require('../degree');

describe("degree", () => {
    test("lookup", () => {
        expect(degree.lookup[1].name).toBe("Minerval");
        expect(degree.lookup[16].name).toBe("Tenth");
        expect(degree.lookup[17]).toBeUndefined();
    });
    test("values", () => {
        expect(degree.values.length).toBe(16);
    });
});
