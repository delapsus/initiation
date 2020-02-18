
/*
let fields = [
    {name:'degreeId', type:'number', isPrimary:true},
    {name:'name'},
    {name:'rank', type:'number'}
];
*/

exports.values = [
    {name:'Minerval', shortName:'0', rank:1, degreeId:1},
    {name:'First', shortName:'1', rank:2, degreeId:2},
    {name:'Second', shortName:'2', rank:3, degreeId:3},
    {name:'Third', shortName:'3', rank:4, degreeId:4},
    {name:'Fourth', shortName:'4', rank:5, degreeId:5},
    {name:'PI', shortName:'PI', rank:6, degreeId:6},
    {name:'KEW', shortName:'KEW', rank:7, degreeId:7},
    {name:'Fifth', shortName:'5', rank:8, degreeId:8},
    {name:'KRE', shortName:'KRE', rank:9, degreeId:9},
    {name:'Sixth', shortName:'6', rank:10, degreeId:10},
    {name:'GIC', shortName:'GIC', rank:11, degreeId:11},
    {name:'PRS', shortName:'PRS', rank:12, degreeId:12},
    {name:'Seventh', shortName:'7', rank:13, degreeId:13},
    {name:'Eighth', shortName:'8', rank:14, degreeId:14},
    {name:'Ninth', shortName:'9', rank:15, degreeId:15},
    {name:'Tenth', shortName:'10', rank:16, degreeId:16}
];

exports.lookup = {};
exports.values.forEach(d => {
    exports.lookup[d.degreeId] = d;
});

exports.unknown = {name:'unknown', rank:0, degreeId:0};