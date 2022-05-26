let values = [
  {name: 'Initiator', rank: 1, officerId: 1, degreeId: [1, 2, 3, 4, 7, 9]},
  {name: 'Wazir', rank: 2, officerId: 2, degreeId: [2, 3, 4]},
  {name: 'Emir', rank: 3, officerId: 3, degreeId: [1, 2, 3, 4]},
  {name: 'Zerrubbabel', rank: 1, officerId: 4, degreeId: [5, 6]},
  {name: 'Haggai', rank: 2, officerId: 5, degreeId: [5, 6]},
  {name: 'Joshua', rank: 3, officerId: 6, degreeId: [5, 6]},
  {name: 'Herald', rank: 4, officerId: 7, degreeId: [5, 6]},
  {name: 'Senior Perfect Magician', rank: 5, officerId: 8, degreeId: [5, 6]},
  {name: 'Assistant 1', rank: 6, officerId: 9, degreeId: [7, 9]},
  {name: 'Assistant 2', rank: 7, officerId: 10, degreeId: [9]},
  {name: 'Most Wise Sovereign', rank: 8, officerId: 11, degreeId: [8]},
  {name: 'High Priestess', rank: 9, officerId: 12, degreeId: [8]},
  {name: 'Grand Marshal', rank: 10, officerId: 13, degreeId: [8]},
];

let unknown = {name: '?', rank: -1, officerId: 0};

let lookup = {};
values.forEach(o => {
  lookup[o.officerId.toString()] = o;
});

export function getOfficerById(officerId) {
  if (isNaN(officerId)) return unknown;

  let key = officerId.toString();
  if (!lookup.hasOwnProperty(key)) {
    console.log('no key: ' + key);
  }

  return lookup[key];
}

export function getOfficerByDegreeId(degreeId) {
  return values.filter(degree => {
    return degree.degreeId.indexOf(degreeId) !== -1;
  });
}
