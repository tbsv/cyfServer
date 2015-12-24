require('../models/tour');

var mongoose = require('mongoose');
var Tour = mongoose.model("Tour");

exports.get = function(req, res){
    Tour.find().exec(function(err, tours){
        res.jsonp(tours);
    });
};

exports.post = function(req, res){
    var tour = new Tour(req.body);
    tour.save();
    res.jsonp(tour);
};

exports.show = function(req, res){
    Tour.load(req.params.tourId, function(err, tour){
        res.jsonp(tour);
    })
};
