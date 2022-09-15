const Express = require('express');
let submit = require('../../submit');
const router = Express.Router();

router.post('/submit-application', function (req, res) {
  submit
    .submitApplication(req.body)
    .then(value => {
      res.send(JSON.stringify(value));
    })
    .catch(console.error);
});

module.exports = router;
