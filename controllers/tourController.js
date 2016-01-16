var db = require('../models/db');
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

    if (!req.body.vehicleId) {
        res.json({success: false, msg: 'Please pass vehicleId.'});
    } else {

        if (!req.body.userId) {
            tour.userId = "guest";
        }

        var updatedTour = tour;

        // save the Tour
        updatedTour.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'There was a problem saving the tour.'});
            }
            res.json({success: true, msg: 'Successful created new tour.'});
        });
    }
};

exports.update = function(req, res){
    Tour.findByIdAndUpdate(req.params.tourId, req.body, function(err, tour){
        if (!tour) {
            return res.status(404).send({success: false, msg: 'Tour not found.'});
        } else {
            Tour.load(req.params.tourId, function(err, tour){
                if (!tour) {
                    return res.status(404).send({success: false, msg: 'Tour not found.'});
                } else {
                    return res.jsonp(tour);
                }
            })
        }
    })
};

exports.show = function(req, res){
    Tour.load(req.params.tourId, function(err, tour){
        if (!tour) {
            return res.status(404).send({success: false, msg: 'Tour not found.'});
        } else {
            return res.jsonp(tour);
        }
    })
};

exports.family = function(req, res){
    var vehicleId = {
        vehicleId: req.params.vehicleId
    };

    Tour.find(vehicleId, function(err, tours){
        if (!tours) {
            return res.status(404).send({success: false, msg: 'Tours not found.'});
        } else {
            return res.jsonp(tours);
        }
    })
};
