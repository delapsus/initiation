
const Database = require('../data/database');
const Person = require('../data/person');

const dataFields = [
    {name:'trackingNumber'},
    {name:'createdDate', type:'datetime'},
    {name:'firstName'},
    {name:'middleName'},
    {name:'lastName'},
    {name:'motto'},
    {name:'mottoOld'},
    {name:'mottoComment'},
    {name:'aliases'},
    {name:'addressComments'},
    {name:'primaryAddress'},
    {name:'primaryAddress2'},
    {name:'primaryCity'},
    {name:'primaryPrincipality'},
    {name:'primaryZip'},
    {name:'primaryCountry'},
    {name:'mailAddress'},
    {name:'mailAddress2'},
    {name:'mailCity'},
    {name:'mailPrincipality'},
    {name:'mailZip'},
    {name:'mailCountry'},
    {name:'otherAddress'},
    {name:'otherAddress2'},
    {name:'otherCity'},
    {name:'otherZip'},
    {name:'otherPrincipality'},
    {name:'otherCountry'},
    {name:'phoneComments'},
    {name:'phoneMain'},
    {name:'phoneMain2'},
    {name:'phoneWork'},
    {name:'phoneEmergency'},
    {name:'fax'},
    {name:'email'},
    {name:'birthCity'},
    {name:'birthCountryFirst'},
    {name:'birthCountryMinerval'},
    {name:'birthPrincipality'},
    {name:'birthDate', type:'datetime'},
    {name:'birthTime'},
    {name:'bodyOfResponsibility'},
    {name:'comments'},
    {name:'difficultiesComments'},
    {name:'difficulty', type:'boolean'},
    {name:'isMaster', type:'boolean'},
    {name:'masterOfBody'},
    {name:'reportComment'},
    {name:'isFelon', type:'boolean'},
    {name:'isDuesInactive', type:'boolean'},
    {name:'isInternationalBadReport', type:'boolean'},
    {name:'isResigned', type:'boolean'},

    {name:'importSource'},
];


async function main() {

    await Database.init(Database.storageType.file);

    const all = await Person.selectAll();
    const person = await Person.selectOne('1');

    person.data.firstName = 'XXX';

    await Person.save(person);

    console.log(all.length)

}

(async () => {
    await main();
})();

