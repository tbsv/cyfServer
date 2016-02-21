var db = require('../models/db');
require('../models/alert');

var mongoose = require('mongoose');
var Alert = mongoose.model("Alert");

exports.get = function(req, res){
    Alert.find().exec(function(err, alerts){
        res.jsonp(alerts);
    });
};

exports.post = function(req, res){
    var alert = new Alert(req.body);

    if (!req.body.alertId) {
        res.json({success: false, msg: 'Please pass alertId.'});
    } else {

        // save the Alert
        alert.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'There was a problem saving the alert.'});
            }
            res.json({success: true, msg: 'Successful created new alert.'});
        });
    }
};

exports.show = function(req, res){
    Alert.load(req.params.alertId, function(err, alert){
        if (!alert) {
            return res.status(404).send({success: false, msg: 'Alert not found.'});
        } else {
            return res.jsonp(alert);
        }
    })
};
