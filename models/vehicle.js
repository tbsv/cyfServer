var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VehicleSchema = new Schema({
    vin:    String
});

mongoose.model('Vehicle', VehicleSchema);