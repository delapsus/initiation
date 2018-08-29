
let values = [
    {name:'Initiator', rank:1, officerId:1},
    {name:'Wazir', rank:2, officerId:2},
    {name:'Emir', rank:3, officerId:3},
    {name:'Zerrubbabel', rank:1, officerId:4},
    {name:'Haggai', rank:2, officerId:5},
    {name:'Joshua', rank:3, officerId:6},
    {name:'Herald', rank:4, officerId:7},
    {name:'Senior Perfect Magician', rank:5, officerId:8},
    {name:'Assistant 1', rank:6, officerId:9},
    {name:'Assistant 2', rank:7, officerId:10},
    {name:'Most Wise Sovereign', rank:8, officerId:11},
    {name:'High Priestess', rank:9, officerId:12},
    {name:'Grand Marshal', rank:10, officerId:13}
];

let unknown = {name:'?', rank:-1, officerId:0};

let lookup = {};
values.forEach(o => {
    lookup[o.officerId.toString()] = o;
});

export function getOfficerById(officerId) {
    if (isNaN(officerId)) return unknown;

    let key = officerId.toString();
    if (!lookup.hasOwnProperty(key))  {
        console.log('no key: ' + key);
    }

    return lookup[key];
}
