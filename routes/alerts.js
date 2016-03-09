var express = require('express');
var router = express.Router();

var alerts = require('../controllers/alertController');

/* Enable CORS */
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

/* GET /alerts */
router.get('/', alerts.get);

/* SHOW /alerts/alertId */
router.get('/:tourId', alerts.show);

/* SHOW /alerts/family/vehicleId */
router.get('/family/:vehicleId', alerts.family);

/* POST -> create new alert */
router.post('/', alerts.post);

/* PUT -> update existing alert */
router.put('/update/:alertId', alerts.update);

module.exports = router;
