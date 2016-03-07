var db = require('../models/db');
var mongoose = require('mongoose');
var db = mongoose.connection;
var unirest = require('unirest');
var dateFormat = require('dateformat');
var Tour = mongoose.model("Tour");
require('../models/tour');

module.exports = {
    getAllVehicles: function () {

        // MongoDB collection vehicles
        var collectionVehicles = db.collection('vehicles');

        // ReADiConnect vehicles
        unirest.get('http://readi.mi.hdm-stuttgart.de/exist/apps/readi/vehicles')
            .header('Accept', 'application/json')
            .end(function (response) {
                var data = JSON.parse(response.body);
                var vehicles = data[0].VINS;
                for (var vehicle in vehicles) {
                    collectionVehicles.update(
                        {vin: vehicles[vehicle]},
                        {vin: vehicles[vehicle]},
                        { upsert: true }
                    );
                }
                //console.log("Total: " + vehicles.length + " vehicles");
            });

    },
    getAllTours: function () {

        // MongoDB collection vehicles
        var collectionVehicles = db.collection('vehicles');

        // Find vehicles of MongoDB
        collectionVehicles.find(function (err, vehicles){
            if (err) {
                console.log(err);
                return;
            }
            // REST call for every vehicle
            vehicles.forEach(function(vehicle) {
                tours(vehicle);
            });
        });

        // REST call for all tours of a vehicle
        function tours (vehicle) {

            var url = "http://readi.mi.hdm-stuttgart.de/exist/apps/readi/tours?vin=" + vehicle._id;

            // ReADiConnect tours (by vehicleId)
            unirest.get(url)
                .header('Accept', 'application/json')
                .end(function (response) {
                    var data = JSON.parse(response.body);
                    var tours = data[0].TIMESTAMPS;
                    var counter = 0;
                    for (tour in tours) {
                        var regTimestamp = dateFormat(vehicle.regTimestamp, "yyyy-mm-dd-HHMMss");

                        // only get tours newer than regTimestamp of vehicle
                        if (regTimestamp <= tours[tour]) {
                            counter++;
                            getLdc(vehicle._id, tours[tour]);
                        }

                    }
                    console.log(vehicle._id + ": " + counter + " tours.");
                })
        }

        // REST call for ldcs of a tour
        function getLdc (vehicleId, tourId) {

            var urlLdc = "http://readi.mi.hdm-stuttgart.de/exist/apps/readi/ldc?vin=" + vehicleId + "&tour=" + tourId;

            //console.log(urlLdc);

            // ReADiConnect ldcs (by vehicleId & tourId)
            unirest.get(urlLdc)
                .header('Accept', 'application/json')
                .end(function (response) {
                    var dataLdc = JSON.parse(response.body);
                    if (dataLdc[0] != null) {
                        var xml = dataLdc[0].LDCXML;
                        ldcinfo(vehicleId, tourId, xml);
                    }
                });

        }

        // REST call for ldcinfo of a tour
        function ldcinfo (vehicleId, tourId, xml) {

            var urlXml = "http://readi.mi.hdm-stuttgart.de/exist/apps/readi/ldcinfo?vin=" + vehicleId + "&tour=" + tourId + "&ldc=" + xml;

            // ReADiConnect XML (specific cyf LDC)
            unirest.get(urlXml)
                .header('Accept', 'application/json')
                .end(function (response) {
                    var ldcXml = JSON.parse(response.body);
                    if (ldcXml.length != 0) {
                        saveTour(vehicleId, ldcXml[0]);
                    }
                })

        }

        // Save a new tour in db
        function saveTour (vehicleId, ldc) {
            var cyf = ldc.Data;
            var tour = new Tour();

            tour.route.timestampStart = ldc.LdcStartTimestamp;
            tour.route.timestampStop = ldc.LdcEndTimestamp;
            tour.route.routeDistance = cyf[10];
            tour.route.routeDuration = cyf[14];

            // prevent empty data
            if (cyf[13] == null) {
                cyf[13] = [];
            } else {
                // remove last character and split values into array
                if (cyf[13].substr(cyf[13].length - 1) == ",") {
                    cyf[13] = cyf[13].substr(0, cyf[13].length - 1);
                    cyf[13] = cyf[13].split(",")
                }
            }

            // prevent empty data
            if (cyf[12] == null) {
                cyf[12] = [];
            } else {
                // remove last character and split values into array
                if (cyf[12].substr(cyf[12].length - 1) == ",") {
                    cyf[12] = cyf[12].substr(0, cyf[12].length - 1);
                    cyf[12] = cyf[12].split(",");
                }
            }

            // prevent empty data
            if (cyf[5] == null) {
                cyf[5] = [];
            } else {
                // remove last character and split values into array
                if (cyf[5].substr(cyf[5].length-1) == ",") {
                    cyf[5] = cyf[5].substr(0, cyf[5].length-1);
                    cyf[5] = cyf[5].split(",");
                }
            }

            tour.route.drivenRoute.gpsLatitude = cyf[13];
            tour.route.drivenRoute.gpsLongitude = cyf[12];
            tour.route.speed = cyf[5];
            tour.ecoScoreTotal = cyf[1];
            tour.ecoScoreDetails.acceleration = cyf[4];
            tour.ecoScoreDetails.constancy = cyf[3];
            tour.ecoScoreDetails.freeWheeling = cyf[2];
            tour.kickdowns = cyf[6];
            tour.fullBreakings = cyf[7];
            tour.espAlerts = 0; // value not available
            tour.geofenceAlerts = false; // default
            tour.speedfenceAlerts = 0;  // default
            tour.userId = "guest"; // default
            tour.vehicleId = vehicleId;

            var upsertData = tour.toObject();

            // Update the tour, if already exists. If not, create new tour.
            Tour.update({"route.timestampStart": ldc.LdcStartTimestamp}, upsertData, {upsert: true},
                function(err){
                    // error handling
            });

        }

    }
};
