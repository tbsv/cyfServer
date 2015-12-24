var express = require('express');
var router = express.Router();

var users = require('../controllers/userController');

/* GET /users */
router.get('/', users.get);

module.exports = router;
