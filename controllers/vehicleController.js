var db = require('../models/db');
var unirest = require('unirest');
require('../models/vehicle');

var mongoose = require('mongoose');
var Vehicle = mongoose.model("Vehicle");

exports.get = function(req, res){
    Vehicle.find().exec(function(err, vehicles){
        res.jsonp(vehicles);
    });
};

exports.readi = function(req, res){
    // ReADiConnect vehicles
    unirest.get('http://readi.mi.hdm-stuttgart.de/exist/apps/readi/vehicles')
        .header('Accept', 'application/json')
        .end(function (response) {
            var data = JSON.parse(response.body);
            var readiVehicles = data[0].VINS;
            var vehicles = [];
            for (var readiVehicle in readiVehicles) {
                vehicles.push({vin: readiVehicles[readiVehicle]});
            };
            res.jsonp(vehicles);
        });
};

exports.post = function(req, res){
    if (!req.body.vin) {
        res.json({success: false, msg: 'Please pass vin.'});
    } else {
        var newVehicle = new Vehicle({
            _id: req.body.vin,
            regTimestamp: new Date(),
            userId: req.body.userId
        });
        // save the Vehicle
        newVehicle.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'There was a problem saving the vehicle.'});
            }
            res.json({success: true, msg: 'Successful created new vehicle.'});
        });
    }

};

exports.update = function(req, res){
    Vehicle.findByIdAndUpdate(req.params.vehicleId, req.body, function(err, vehicle){
        if (!vehicle) {
            return res.status(404).send({success: false, msg: 'Vehicle not found. A'});
        } else {
            Vehicle.load(req.params.vehicleId, function(err, vehicle){
                if (!vehicle) {
                    return res.status(404).send({success: false, msg: 'Vehicle not found. B'});
                } else {
                    return res.jsonp(vehicle);
                }
            })
        }
    })
};

exports.show = function(req, res){
    Vehicle.load(req.params.vehicleId, function(err, vehicle){
        res.jsonp(vehicle);
    })
};
