
let XLSX = require('xlsx');
let fs = require('fs');

exports.loadWorkbook = function() {
    console.log('loading xlsx');
    let workbook = loadWorkbook();
    console.log('parsing sheet');
    let data = parseSheet(workbook.Sheets['Sheet1']);
    return data;
};

function loadWorkbook() {
    let raw = fs.readFileSync('exported.txt');

    // convert data to binary string
    let data = new Uint8Array(raw);
    let arr = new Array();
    for (let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    let bstr = arr.join("");

    // Call XLSX
    let workbook = XLSX.read(bstr, {type:"binary"});

    return workbook;
}

function parseSheet(sheet) {

    let rows = [];

    let reValid = /[A-Z]+\d+/;
    let reColKey = /([A-Z]+)\d+/;
    let reRowKey = /[A-Z]+(\d+)/;

    for (let key in sheet) {
        if (!key.match(reValid)) continue;

        let colKey = key.match(reColKey)[1];
        let rowKey = key.match(reRowKey)[1];
        let colIndex = columnToIndex(colKey);
        let rowIndex = (+rowKey) - 1;

        if (!rows[rowIndex]) rows[rowIndex] = [];
        let row = rows[rowIndex];
        row[colIndex] = sheet[key].v;
    }

    let headers = rows[0];
    let products = [];

    for (let i = 1; i < rows.length; i++) {
        let o = parseRow(rows[i], headers);
        if (o !== null) products.push(o);
    }

    return products;
}

function parseRow(row, headers) {
    let o = {};
    let hasData = false;

    for (let j = 0; j < headers.length; j++) {
        if (!hasData && typeof row[j] !== 'undefined') hasData = true;

        let v = row[j];

        if (typeof v === 'string') {

            v = v.replace(/_x000D_/g, '\r');

            // fix the Spectre_x360_HDD_Kit hp issue
            if (v.indexOf('`') !== -1) v = v.replace(/`/g, '_x360_');

            if (v.indexOf('\r\n') !== -1) {
                v = v.split('\r\n');

                // remove any extra line breaks
                for (let k = 0; k < v.length; k++) {
                    v[k] = v[k].replace('\r', '');
                }
            }
        }

        o[headers[j]] = v;
    }

    if (hasData) return o;
    return null;
}

function columnToIndex(col) {
    if (col.length === 1) return col.charCodeAt(0) - 65;
    return (col.charCodeAt(1) - 65) + (col.charCodeAt(0) - 64) * 26;
}

if (module.parent === null) {

    let data = exports.loadWorkbook();
    console.log(data.length);
}
