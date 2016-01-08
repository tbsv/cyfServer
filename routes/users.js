var express = require('express');
var router = express.Router();

var users = require('../controllers/userController');
var passport = require('passport');

/* GET -> get all users */
router.get('/', users.get);

/* GET -> get userinfo (only with authorization) */
router.get('/userinfo', passport.authenticate('jwt', { session: false}), users.userinfo);

/* POST -> create new user */
router.post('/signup', users.signup);

/* POST -> get user authentication */
router.post('/auth', users.authenticate);

/* POST -> update existing user */
router.post('/update', users.update);

module.exports = router;
