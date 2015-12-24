var db = require('../models/db');
var mongoose = require('mongoose');
var db = mongoose.connection;
var unirest = require('unirest');

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
                console.log("Total: " + vehicles.length + " vehicles");
            });

    },
    getAllTours: function () {

        // MongoDB collection vehicles & tours
        var collectionVehicles = db.collection('vehicles');
        var collectionTours = db.collection('tours');

        // Find vehicles of MongoDB
        collectionVehicles.find(function (err, docs){
            if (err) {
                console.log(err);
                return;
            }
            // REST call for every VIN
            docs.forEach(function(doc) {
                tours(doc.vin);
            });
        });

        // REST call
        function tours (vin) {

            var url = "http://readi.mi.hdm-stuttgart.de/exist/apps/readi/tours?vin=" + vin;

            // ReADiConnect tours
            unirest.get(url)
                .header('Accept', 'application/json')
                .end(function (response) {
                    var data = JSON.parse(response.body);
                    var tours = data[0].TIMESTAMPS;
                    for (tour in tours) {
                        collectionTours.update(
                            {timestamp: tours[tour]},
                            {vin: vin, timestamp: tours[tour]},
                            {upsert: true}
                        );
                    }
                    console.log(vin + ": " + tours.length + " tours");
                })
        }

    }
};
