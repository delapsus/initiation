const Express = require('express');
let dataCache = require('../../data-cache');

const router = Express.Router();
router.get('', function (req, res) {
  dataCache
    .getPerson(parseInt(req.query.personId))
    .then(value => {
      res.send(JSON.stringify(value));
    })
    .catch(console.error);
});
module.exports = router;
