
/*
let fields = [
    {name:'degreeId', type:'number', isPrimary:true},
    {name:'name'},
    {name:'rank', type:'number'}
];
*/

exports.values = [
    {name:'Minerval', rank:1, degreeId:1},
    {name:'First', rank:2, degreeId:2},
    {name:'Second', rank:3, degreeId:3},
    {name:'Third', rank:4, degreeId:4},
    {name:'Fourth', rank:5, degreeId:5},
    {name:'PI', rank:6, degreeId:6},
    {name:'KEW', rank:7, degreeId:7},
    {name:'Fifth', rank:8, degreeId:8},
    {name:'KRE', rank:9, degreeId:9},
    {name:'Sixth', rank:10, degreeId:10},
    {name:'GIC', rank:11, degreeId:11},
    {name:'PRS', rank:12, degreeId:12},
    {name:'Seventh', rank:13, degreeId:13},
    {name:'Eighth', rank:14, degreeId:14},
    {name:'Ninth', rank:15, degreeId:15},
    {name:'Tenth', rank:16, degreeId:16}
];

exports.lookup = {};
exports.values.forEach(d => {
    exports.lookup[d.degreeId] = d;
});
