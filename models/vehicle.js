var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vehicleSchema = new Schema({
    _id: { type: String, required: true},
    regTimestamp: { type: Date, required: true},
    userId: { type: String, required: true},
    licenceNumber: { type: String, required: true}
});

vehicleSchema.statics = {
    load: function(id, cb){
        this.findOne({vin: id}).exec(cb);
    }
};

//mongoose.model('Vehicle', VehicleSchema);
// the schema is useless so far
// we need to create a model using it
var Vehicle = mongoose.model('Vehicle', vehicleSchema);

// make this available to our users in our Node applications
module.exports = Vehicle;