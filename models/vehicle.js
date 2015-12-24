var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VehicleSchema = new Schema({
    vin:    String,
    userId: String
});

VehicleSchema.statics = {
    load: function(id, cb){
        this.findOne({vin: id}).exec(cb);
    }
};

mongoose.model('Vehicle', VehicleSchema);
