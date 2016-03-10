var db = require('../models/db');
var unirest = require('unirest');
require('../models/vehicle');
var mongoose = require('mongoose');
var Vehicle = mongoose.model("Vehicle");

var readiService = require('../services/readiService');

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

exports.checkReadi = function(req, res){

    var vin = req.params.vehicleId;

    var isInArray = function(value, array) {
        return array.indexOf(value) > -1;
    };

    // ReADiConnect vehicles
    unirest.get('http://readi.mi.hdm-stuttgart.de/exist/apps/readi/vehicles')
        .header('Accept', 'application/json')
        .end(function (response) {
            var data = JSON.parse(response.body);
            var readiVehicles = data[0].VINS;
            var vehicles = [];
            for (var readiVehicle in readiVehicles) {
                vehicles.push(readiVehicles[readiVehicle]);
            };

            if (!isInArray(vin, vehicles)) {
                return res.json({success: false, msg: 'VIN does not exists.'});
            }
            res.json({success: true, msg: 'Your inserted VIN was successful enrolled to you.'});
        });
};

exports.post = function(req, res){
    if (!req.body.vin) {
        res.json({success: false, msg: 'Please pass vin.'});
    } else {

        // Set default reqTimestamp for valid results
        if (req.body.vin == 'WDD1179421N250123') {
            // mhenger ab 14.02.2016
            var validTimestamp = '2016-02-14T00:00:00.000Z';
        } else if (req.body.vin == 'WDD1179121N355937') {
            // rhenger CLA ab 07.03.2016
            var validTimestamp = '2016-03-07T00:00:00.000Z';
        } else if (req.body.vin == 'WDD2122061B140828') {
            // rhenger E-Kombi ab 02.02.2016 bis 25.02.2016!
            var validTimestamp = '2016-02-02T00:00:00.000Z';
        } else {
            var validTimestamp = new Date();
        }

        var newVehicle = new Vehicle({
            _id: req.body.vin,
            regTimestamp: validTimestamp,
            licenceNumber: req.body.licenceNumber,
            userId: req.body.userId
        });

        // save the Vehicle
        newVehicle.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'There was a problem saving the vehicle.'});
            }
            res.json({success: true, msg: 'Successful created new vehicle.'});
            readiService.getAllTours();
        });
    }

};

exports.update = function(req, res){
    Vehicle.findByIdAndUpdate(req.params.vehicleId, req.body, function(err, vehicle){
        if (!vehicle) {
            return res.status(404).send({success: false, msg: 'Vehicle not found.'});
        } else {
            Vehicle.load(req.params.vehicleId, function(err, vehicle){
                if (!vehicle) {
                    return res.status(404).send({success: false, msg: 'Vehicle not found.'});
                } else {
                    return res.jsonp(vehicle);
                }
            })
        }
    })
};

exports.show = function(req, res){
    Vehicle.load(req.params.vehicleId, function(err, vehicle){
        if (!vehicle) {
            return res.status(404).send({success: false, msg: 'Vehicle not found.'});
        } else {
            return res.jsonp(vehicle);
        }
    })
};
