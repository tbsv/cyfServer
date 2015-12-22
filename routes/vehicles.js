var express = require('express');
var router = express.Router();

var vehicles = require('../controllers/vehicleController');

/* GET /vehicles */
router.get('/', vehicles.get);

/* SHOW /vehicles/123456789 */
router.get('/:vehicleId', vehicles.show);

/* POST /vehicles */
router.post('/', vehicles.post);

module.exports = router;
