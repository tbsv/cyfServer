var db = require('../models/db');
var passport = require('passport');
var jwt = require('jwt-simple');

require('../models/user');
require('../services/authService')(passport);

var mongoose = require('mongoose');
var User = mongoose.model("User");

exports.get = function(req, res){
    User.find().exec(function(err, users){
        res.jsonp(users);
    });
};

exports.signup = function(req, res){
    if (!req.body.name || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var newUser = new User({
            _id: req.body.name,
            password: req.body.password,
            name: {
                first: req.body.firstname,
                last: req.body.lastname
            },
            role: req.body.role
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
};

exports.createMember = function(req, res){
    if (!req.body.name) {
        res.json({success: false, msg: 'Please pass member name.'});
    } else {
        var newUser = new User({
            _id: req.body.name,
            password: req.body.password,
            name: {
                first: req.body.firstname,
                last: req.body.lastname
            },
            role: req.body.role,
            vin: req.body.vin
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new member.'});
        });
    }
};

exports.authenticate = function(req, res){
    User.findOne({
        _id: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user, db.secret);
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
};

exports.userinfo = function(req, res){
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, db.secret);
        User.findOne({
            _id: decoded._id
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                return res.json({success: true, msg: 'You are authorized, ' + user._id + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};

exports.update = function(req, res){
    User.findByIdAndUpdate(req.params.userId, req.body, function(err, user){
        if (!user) {
            return res.status(404).send({success: false, msg: 'User not found.'});
        } else {
            User.load(req.params.userId, function(err, user){
                if (!user) {
                    return res.status(404).send({success: false, msg: 'User not found.'});
                } else {
                    //delete user.password before response
                    user.password = undefined;
                    return res.jsonp(user);
                }
            })
        }
    })
};

exports.show = function(req, res){
    User.load(req.params.userId, function(err, user){
        if (!user) {
            return res.status(404).send({success: false, msg: 'User not found.'});
        } else {
            //delete user.password before response
            user.password = undefined;
            return res.jsonp(user);
        }
    })
};

exports.family = function(req, res){
    var vehicleId = {
        vin: req.params.vehicleId
    };

    User.find(vehicleId, function(err, users){
        if (!users) {
            return res.status(404).send({success: false, msg: 'Members not found.'});
        } else {
            //delete user.password before response
            //user.password = undefined;
            return res.jsonp(users);
        }
    })

    /*
    User.find(req.params.vehicleId).exec(function(err, users){
        res.jsonp(users);
    });
    */
};

// Get Token out of Authorization Header
getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
