require('../models/vehicle');

var mongoose = require('mongoose');
var Vehicle = mongoose.model("Vehicle");

exports.get = function(req, res){
    Vehicle.find().exec(function(err, vehicles){
        res.jsonp(vehicles);
    });
};

exports.post = function(req, res){
    var vehicle = new Vehicle(req.body);
    vehicle.save();
    res.jsonp(vehicle);
};

exports.show = function(req, res){
    Vehicle.load(req.params.vehicleId, function(err, vehicle){
        res.jsonp(vehicle);
    })
};
