var express = require('express');
var router = express.Router();

var vehicles = require('../controllers/vehicleController');

/* GET /vehicles */
router.get('/', vehicles.get);

/* POST /vehicles */
router.post('/', vehicles.post);

module.exports = router;
