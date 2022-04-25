const Express = require('express');
let dataCache = require('../../data-cache');
let submit = require('../../submit');
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

router.get('/person', function (req, res) {
  dataCache
    .getPerson(parseInt(req.query.personId, 10))
    .then(value => {
      res.send(JSON.stringify(value));
    })
    .catch(console.error);
});

router.get('/person-with-data', function (req, res) {
  dataCache
    .getPersonWithFullData(parseInt(req.query.personId, 10))
    .then(value => {
      res.send(JSON.stringify(value));
    })
    .catch(console.error);
});

router.post('/submit-person-picker', async function (req, res) {
  try {
    let personId = await submit.submitPersonPicker(req.body);
    res.send(JSON.stringify({personId: personId}));
  } catch (err) {
    console.error(err);
  }
});

//   router.post('/data/merge-person', function (req, res) {
//     let masterPersonId = req.body.masterPersonId;
//     let slavePersonId = req.body.slavePersonId;

//     submit
//       .mergePerson(masterPersonId, slavePersonId)
//       .then(value => {
//         res.send(JSON.stringify(value));
//       })
//       .catch(console.error);
//   });
//   router.post('/data/submit-edit-person', async function (req, res) {
//     try {
//       const value = await submit.submitEditPerson(req.body);
//       res.send(JSON.stringify(value));
//     } catch (err) {
//       console.error(err);
//     }
//   });

module.exports = router;
