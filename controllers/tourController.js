var db = require('../models/db');
var unirest = require('unirest');
require('../models/alert');
require('../models/tour');

var mongoose = require('mongoose');
var Alert = mongoose.model("Alert");
var Tour = mongoose.model("Tour");
var User = mongoose.model("User");
var Vehicle = mongoose.model("Vehicle");

var haversine = require('haversine-distance')

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

                    // Check if fences are active and check violation
                    User.load(tour.userId, function(err, user) {
                        if (!user) {
                            // nothing
                        } else {
                            if (user.speedfenceActive) {
                                checkSpeedfence(tour);
                            }
                            if (user.geofenceActive) {
                                checkGeofence(tour);
                            }
                        }
                    });

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

// Check Speedfence and update Speedfence Alerts for tour
checkSpeedfence = function(tour) {

    User.load(tour.userId, function(err, user){
        if (!user) {
            // nothing
        } else {
            var speedCount = 0;

            if (user.speedfence != null) {
                for(var i = 0; i < tour.route.speed.length; ++i){
                    if(tour.route.speed[i-1] <= user.speedfence && tour.route.speed[i] > user.speedfence)
                        speedCount++;
                }
            }

            var speedfenceUpdate = {
                speedfenceAlerts: speedCount,
                speedfenceValue: user.speedfence
            };

            if (speedCount > 0) {
                Tour.findByIdAndUpdate(tour._id, speedfenceUpdate, function(err, tour){
                    if (!tour) {
                        console.log("Tour not found.");
                    } else {

                        var newSpeedfenceAlert = new Alert({
                            route: {
                                timestampStart: tour.route.timestampStart,
                                timestampStop: tour.route.timestampStop,
                            },
                            type: 'speedfence',
                            vehicleId: tour.vehicleId,
                            tourId: tour._id,
                            userId: tour.userId
                        });

                        // save the speedfence alert
                        newSpeedfenceAlert.save(function(err) {
                            if (err) {
                                //return res.json({success: false, msg: 'There was a problem saving the alert.'});
                            }

                            // get the master user for vehicle
                            Vehicle.load(tour.vehicleId, function(err, vehicle) {
                                if (!vehicle) {
                                    // nothing
                                } else {
                                    var pushMaster = vehicle.userId;

                                    var pushNotificationMaster = {
                                        "app_id": "634f161c-9936-462f-89a9-9b8a389a7cdf",
                                        "contents": {
                                            "en": tour.userId + " violated the speedfence"
                                        },
                                        "tags": [
                                            {
                                                "key": "userId",
                                                "relation": "=",
                                                "value": pushMaster
                                            }
                                        ]
                                    };

                                    var pushNotificationChild = {
                                        "app_id": "634f161c-9936-462f-89a9-9b8a389a7cdf",
                                        "contents": {
                                            "en": "You violated the speedfence"
                                        },
                                        "tags": [
                                            {
                                                "key": "userId",
                                                "relation": "=",
                                                "value": tour.userId
                                            }
                                        ]
                                    };

                                    // Push notification for master
                                    unirest.post('https://onesignal.com/api/v1/notifications')
                                        .header({'Content-Type': 'application/json', 'Authorization': 'Basic YmJmODdjMGItNDMzYi00MDcyLWJlMGQtMDg3ZTZiMjNiNDhk'})
                                        .send(pushNotificationMaster)
                                        .end(function (response) {
                                            console.log(response.body);
                                        });

                                    // Push notification for child
                                    unirest.post('https://onesignal.com/api/v1/notifications')
                                        .header({'Content-Type': 'application/json', 'Authorization': 'Basic YmJmODdjMGItNDMzYi00MDcyLWJlMGQtMDg3ZTZiMjNiNDhk'})
                                        .send(pushNotificationChild)
                                        .end(function (response) {
                                            console.log(response.body);
                                        });


                                }
                            });

                        });

                        console.log("Updated speedfenceAlerts ("+ speedCount +  ") for " + tour.userId + ".");
                    }
                });
            }

        }
    });

};

// Check Geofence and update Geofence Alerts for tour
checkGeofence = function(tour) {

    User.load(tour.userId, function(err, user){
        if (!user) {
            console.log("User not found.");
        } else {
            var geofenceViolation = false;

            if (user.geofence != null) {

                for(var i = 0; i < tour.route.drivenRoute.gpsLatitude.length; ++i){

                    // Calculation of distance with haversine formula
                    var tourLocation = {
                        latitude: tour.route.drivenRoute.gpsLatitude[i],
                        longitude: tour.route.drivenRoute.gpsLongitude[i]
                    };
                    var geofenceMarker = {
                        latitude: user.geofence.latitude,
                        longitude: user.geofence.longitude
                    };


                    var distanceMeter = haversine(tourLocation, geofenceMarker);
                    console.log(distanceMeter);

                    // If Geofence violated, set value to true
                    if (distanceMeter <= user.geofence.radius) {
                        geofenceViolation = true;
                    }

                }
            }

            var geofenceUpdate = {
                geofenceAlerts: geofenceViolation,
                geofenceValue: {
                    latitude: user.geofence.latitude,
                    longitude: user.geofence.longitude,
                    radius: user.geofence.radius
                }
            };

            Tour.findByIdAndUpdate(tour._id, geofenceUpdate, function(err, tour){
                if (!tour) {
                    console.log("Tour not found.");
                } else {

                    var newGeofenceAlert = new Alert({
                        route: {
                            timestampStart: tour.route.timestampStart,
                            timestampStop: tour.route.timestampStop,
                        },
                        type: 'geofence',
                        vehicleId: tour.vehicleId,
                        tourId: tour._id,
                        userId: tour.userId
                    });

                    // save the geofence alert
                    newGeofenceAlert.save(function(err) {
                        if (err) {
                            //return res.json({success: false, msg: 'There was a problem saving the alert.'});
                        }
                        //res.json({success: true, msg: 'Successful created new geofence alert.'});
                    });

                    console.log("Updated geofenceAlerts (" + geofenceViolation + ") for " + tour.userId + ".");
                }
            });

        }
    });

};
