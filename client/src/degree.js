let values = [
    {name:'0', rank:0, longName:'Minerval'},
    {name:'1', rank:1, longName:'First'},
    {name:'2', rank:2, longName:'Second'},
    {name:'3', rank:3, longName:'Third'},
    {name:'4', rank:4, longName:'Fourth'},
    {name:'PI', rank:5, longName:'P.I.'},
    {name:'KEW', rank:6, longName:'K.E.W.'},
    {name:'5', rank:7, longName:'Fifth'},
    {name:'KRE', rank:8, longName:'K.R.E.'},
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

export let allDegrees = values;

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