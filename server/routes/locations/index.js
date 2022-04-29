const Express = require('express');
let dataCache = require('../../data-cache');
let submit = require('../../submit');
const router = Express.Router();

router.get('', function (req, res) {
  const payload = {
    pageSize: parseInt(req.query.pageSize, 10),
    index: parseInt(req.query.index, 10),
    textSearch: req.query.textSearch,
  };
  dataCache
    .getLocations(payload)
    .then(value => {
      res.send(JSON.stringify(value));
    })
    .catch(console.error);
});

router.get('/location', function (req, res) {
  dataCache
    .getLocation(parseInt(req.query.locationId, 10))
    .then(value => {
      res.send(JSON.stringify(value));
    })
    .catch(console.error);
});

router.get('/location-with-data', function (req, res) {
  dataCache
    .getLocationWithInitiations(parseInt(req.query.locationId, 10))
    .then(value => {
      res.send(JSON.stringify(value));
    })
    .catch(console.error);
});

router.post('/submit-location-picker', async function (req, res) {
  try {
    let locationId = await submit.submitLocationPicker(req.body);
    res.send(JSON.stringify({locationId: locationId}));
  } catch (err) {
    console.error(err);
  }
});
router.post('/submit-edit-location', async function (req, res) {
  try {
    const value = await submit.submitEditLocation(req.body);
    res.send(JSON.stringify(value));
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
