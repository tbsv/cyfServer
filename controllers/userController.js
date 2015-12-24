require('../models/user');

var mongoose = require('mongoose');
var User = mongoose.model("User");

exports.get = function(req, res){
    User.find().exec(function(err, users){
        res.jsonp(users);
    });
};

exports.post = function(req, res){
    var user = new User(req.body);
    user.save();
    res.jsonp(user);
};

exports.show = function(req, res){
    User.load(req.params.userId, function(err, user){
        res.jsonp(user);
    })
};
