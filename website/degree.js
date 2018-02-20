let values = [
    {name:'Minerval', rank:0},
    {name:'First', rank:1},
    {name:'Second', rank:2},
    {name:'Third', rank:3},
    {name:'Fourth', rank:4},
    {name:'PI', rank:5},
    {name:'KEW', rank:6},
    {name:'Fifth', rank:7},
    {name:'KRE', rank:8},
    {name:'Sixth', rank:9},
    {name:'GIC', rank:10},
    {name:'PRS', rank:11},
    {name:'Seventh', rank:12},
    {name:'Eighth', rank:13},
    {name:'Ninth', rank:14},
    {name:'Tenth', rank:15}
];


let lookup = null;

function getDegreeLookup() {
    if (lookup === null) {
        lookup = {};
        values.forEach(o => {
            o.degreeId = o.rank + 1;
            lookup[o.degreeId] = o;
        });
    }
    return lookup;
}

export function getDegreeById(degreeId) {
    let lu = getDegreeLookup();
    return lu[degreeId];
}
