var express = require('express');
var router = express.Router();

var users = require('../controllers/userController');
var passport = require('passport');

/* Enable CORS */
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

/* GET -> get all users */
router.get('/', users.get);

/* GET -> get userinfo (only with authorization) */
router.get('/userinfo', passport.authenticate('jwt', { session: false}), users.userinfo);

/* SHOW /users/userId */
router.get('/:userId', users.show);

/* SHOW /users/family/vehicleId */
router.get('/family/:vehicleId', users.family);

/* POST -> create new user */
router.post('/signup', users.signup);

/* POST -> create new family member */
router.post('/family', users.createMember);

/* POST -> get user authentication */
router.post('/auth', users.authenticate);

/* PUT -> update existing user */
router.put('/update/:userId', users.update);

module.exports = router;
