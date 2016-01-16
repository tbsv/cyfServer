var express = require('express');
var router = express.Router();

var tours = require('../controllers/tourController');

/* GET /tours */
router.get('/', tours.get);

/* SHOW /tours/tourId */
router.get('/:tourId', tours.show);

/* SHOW /tours/family/vehicleId */
router.get('/family/:vehicleId', tours.family);

/* POST -> create new tour */
router.post('/', tours.post);

/* PUT -> update existing tour */
router.put('/update/:tourId', tours.update);

module.exports = router;
