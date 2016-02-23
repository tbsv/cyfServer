var express = require('express');
var router = express.Router();

var tours = require('../controllers/tourController');

/* Enable CORS */
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

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
