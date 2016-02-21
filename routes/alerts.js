var express = require('express');
var router = express.Router();

var alerts = require('../controllers/alertController');

/* Enable CORS */
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

/* GET /alerts */
router.get('/', alerts.get);

/* SHOW /alerts/alertId */
router.get('/:tourId', alerts.show);

/* POST -> create new alert */
router.post('/', alerts.post);

module.exports = router;
