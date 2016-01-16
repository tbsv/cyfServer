var express = require('express');
var router = express.Router();

var vehicles = require('../controllers/vehicleController');

/* GET /vehicles */
router.get('/', vehicles.get);

/* GET /vehicles of ReADiConnect */
router.get('/readi', vehicles.readi);

/* SHOW /vehicles/vehicleId */
router.get('/:vehicleId', vehicles.show);

/* POST -> create new vehicle */
router.post('/', vehicles.post);

/* PUT -> update existing vehicle */
router.put('/update/:vehicleId', vehicles.update);

module.exports = router;
