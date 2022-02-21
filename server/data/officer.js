/*
let tableName = 'Officer';

let fields = [
    {name:'officerId', type:'number', isPrimary:true},
    {name:'name'},
    {name:'rank', type:'number'}
];
*/

const values = [
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

const lookup = {};
values.forEach(o => {
    lookup[o.officerId] = o;
});

module.exports = {values, lookup};
