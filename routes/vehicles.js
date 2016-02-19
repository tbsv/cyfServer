var express = require('express');
var router = express.Router();

var vehicles = require('../controllers/vehicleController');

/* Enable CORS */
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

/* GET -> get all vehicles */
router.get('/', vehicles.get);

/* GET -> get all vehicles of ReADiConnect */
router.get('/readi', vehicles.readi);

/* GET -> check specific vehicle with ReADiConnect */
router.get('/readi/:vehicleId', vehicles.checkReadi);

/* SHOW /vehicles/vehicleId */
router.get('/:vehicleId', vehicles.show);

/* POST -> create new vehicle */
router.post('/', vehicles.post);

/* PUT -> update existing vehicle */
router.put('/update/:vehicleId', vehicles.update);

module.exports = router;
