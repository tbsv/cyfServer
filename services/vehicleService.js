var db = require('../models/db');
var mongoose = require('mongoose');
var db = mongoose.connection;
var unirest = require('unirest');

module.exports = {
    getAllVehicles: function () {

        // MongoDB collection vehicles
        var collection = db.collection('vehicles');

        // ReADiConnect vehicles
        unirest.get('http://readi.mi.hdm-stuttgart.de/exist/apps/readi/vehicles')
            .header('Accept', 'application/json')
            .end(function (response) {
                var data = JSON.parse(response.body);
                var json = data[0].VINS;
                var vehicles = [];
                for (var vehicle in json) {
                    vehicles.push({vin: json[vehicle]});
                }

                for (vehicle in vehicles) {
                    collection.update(
                        vehicles[vehicle],
                        vehicles[vehicle],
                        { upsert: true }
                    );
                }

            });

    }
};