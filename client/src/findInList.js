
let trailing = [0,1,2,3,4,6,7,8,9,10];

for (let j = 0; j < trailing.length; j++) {
    //console.log(findIndex(trailing, trailing[j], 0, trailing.length));
}

console.log(findIndex(trailing, 5, 0, trailing.length));


function findIndex(a, val, i0, i1) {
    if (i0 === i1) return i0;
    let i = Math.floor((i0 + i1) / 2);
    if (val <= a[i]) return findIndex(a, val, i0, i);
    else return findIndex(a, val, i+1, i1);
}