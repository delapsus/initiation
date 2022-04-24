const Express = require('express');
let dataCache = require('../../data-cache');

const router = Express.Router();
router
  // people search
  .get('', function (req, res) {
    let query = {};
    query.pageSize = parseInt(req.query.pageSize, 10);
    query.index = parseInt(req.query.index, 10);
    query.textSearch = req.query.textSearch;
    query.degreeId = parseInt(req.query.degreeId, 10);
    query.sortBy = parseInt(req.query.sortBy, 10);

    dataCache
      .getPeople(query)
      .then(value => {
        res.send(JSON.stringify(value));
      })
      .catch(console.error);
  });

module.exports = router;
