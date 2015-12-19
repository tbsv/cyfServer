require('../models/vehicle');

var mongoose = require('mongoose');
var Vehicle = mongoose.model("Vehicle");



exports.get = function($http, req, res){

    var request = require("request");
    request.get("http://readi.mi.hdm-stuttgart.de/exist/apps/readi/vehicles/",function(error,response,body){
        if(error){
            console.log(error);
        }else{
            console.log(response);
            var vehicle = new Vehicle(body[0]);
            vehicle.save();
            response.jsonp(vehicle);
        }
    });

}



exports.post = function(req, res){
    var vehicle = new Vehicle(req.body);
    vehicle.save();
    res.jsonp(vehicle);
}

