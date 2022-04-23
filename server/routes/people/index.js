const Express = require('express');
let dataCache = require('../../data-cache');

const router = Express.Router();
router
  // people search
  .get('', function (req, res) {
    let query = {};
    query.pageSize = parseInt(req.query.pageSize);
    query.index = parseInt(req.query.index);
    query.textSearch = req.query.textSearch;
    query.degreeId = parseInt(req.query.degreeId);
    query.sortBy = parseInt(req.query.sortBy);

    dataCache
      .getPeople(query)
      .then(value => {
        res.send(JSON.stringify(value));
      })
      .catch(console.error);
  });

module.exports = router;
