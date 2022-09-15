const Express = require('express');
let submit = require('../../submit');
const router = Express.Router();
let dataCache = require('../../data-cache');
let annualReport = require('../../reports/yearly');
let waitingForInitiationReport = require('../../reports/waitingForInitiation');
let XLSX = require('xlsx');


router.post('/submit-initiation-report', function (req, res) {
    submit
        .submitInitiationReport(req.body)
        .then(value => {
            res.send(JSON.stringify(value));
        })
        .catch(console.error);
});

router.get('/annual', async function (req, res) {
    // read year from QS
    let year = 1985;
    if (req.query.hasOwnProperty('year')) {
        year = +req.query.year;
    }

    // generate the data
    let data = await annualReport.generate(year);

    // create the workbook
    let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(data);

    // add worksheet to workbook
    let ws_name = year.toString();
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    // write the XLSX to response
    let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    let filename = `annual-report-${year}_${getDateTimeString()}.xlsx`;
    res.header('Content-Type', 'application/octet-stream');
    res.header('Content-disposition', 'attachment;filename=' + filename);
    res.header('Content-Length', wbout.length);

    res.end(new Buffer(wbout, 'binary'));
});

router.get('/waiting', async function (req, res) {
    // read year from QS
    let minDegreeId, maxDegreeId, minYearsWaiting, maxYearsWaiting;
    minDegreeId = +req.query.minDegreeId;
    maxDegreeId = +req.query.maxDegreeId;
    minYearsWaiting = +req.query['minYears'];
    maxYearsWaiting = +req.query['maxYears'];

    // generate the data
    let data = await waitingForInitiationReport.generate(
        minDegreeId,
        maxDegreeId,
        minYearsWaiting,
        maxYearsWaiting
    );

    // create the workbook
    let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(data);

    // add worksheet to workbook
    let ws_name = 'waiting for initiation';
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    // write the XLSX to response
    let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    let filename = `waiting-for-initiation_${getDateTimeString()}.xlsx`;
    res.header('Content-Type', 'application/octet-stream');
    res.header('Content-disposition', 'attachment;filename=' + filename);
    res.header('Content-Length', wbout.length);

    res.end(new Buffer(wbout, 'binary'));
});

function getDateTimeString() {
    var now = new Date();

    var yy = now.getFullYear().toString().substr(2);
    var mm = forceLeadingZero((now.getMonth() + 1).toString());
    var dd = forceLeadingZero(now.getDate().toString());
    var HH = forceLeadingZero(now.getHours().toString());
    var MM = forceLeadingZero(now.getMinutes().toString());
    var SS = forceLeadingZero(now.getSeconds().toString());

    return yy + mm + dd + '-' + HH + MM + SS;
}

function forceLeadingZero(s) {
    if (s.length == 1) return '0' + s;
    return s;
}

module.exports = router;
