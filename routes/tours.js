var express = require('express');
var router = express.Router();

var tours = require('../controllers/tourController');

/* GET /tours */
router.get('/', tours.get);

/* SHOW /tours/123456789 */
router.get('/:tourId', tours.show);

/* POST /tours */
router.post('/', tours.post);

module.exports = router;
