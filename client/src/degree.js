let values = [
    {name:'0', rank:0},
    {name:'1', rank:1},
    {name:'2', rank:2},
    {name:'3', rank:3},
    {name:'4', rank:4},
    {name:'PI', rank:5},
    {name:'KEW', rank:6},
    {name:'5', rank:7},
    {name:'KRE', rank:8},
    {name:'6', rank:9},
    {name:'GIC', rank:10},
    {name:'PRS', rank:11},
    {name:'7', rank:12},
    {name:'8', rank:13},
    {name:'9', rank:14},
    {name:'10', rank:15}
];

let unknown = {name:'?', rank:-1, degreeId:0};

let lookup = {};
values.forEach(o => {
    o.degreeId = o.rank + 1;
    lookup[o.degreeId.toString()] = o;
});


export function getDegreeById(degreeId) {
    if (isNaN(degreeId)) return unknown;

    let key = degreeId.toString();
    if (!lookup.hasOwnProperty(key))  {
        console.log('no key: ' + key);
    }

    return lookup[key];
}

export function getDegreeByName(name) {
    let degree = null;
    values.forEach(d => {
        if (d.name === name) degree = d;
    });

    return degree;
}