const Express = require('express');
let submit = require('../../submit');
const router = Express.Router();
let dataCache = require('../../data-cache');

router.get('', function (req, res) {
    dataCache
        .getInitiationWithData(req.query.initiationId)
        .then(value => {
            res.send(JSON.stringify(value));
        })
        .catch(console.error);
});

router.get('/all', function (req, res) {
    let query = {};
    query.pageSize = parseInt(req.query.pageSize, 10);
    query.index = parseInt(req.query.index, 10);
    query.status = req.query.status;
    query.degreeId = parseInt(req.query.degreeId, 10);
    query.sort = req.query.sort;
    query.maxDays = parseInt(req.query.maxDays, 10);
    query.locationId = parseInt(req.query.locationId, 10);

    dataCache
        .getInitiations(query)
        .then(value => {
            res.send(JSON.stringify(value));
        })
        .catch(console.error);
});

module.exports = router;
