var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tourSchema = new Schema({
    route: {
        timestampStart: Date,
        timestampStop: Date,
        mileageStart: Number,
        mileageStop: Number,
        routeDistance: Number,
        routeDuration: Number,
        drivenRoute: {
            gpsLatitude: Array,
            gpsLongitude: Array
        },
        speed: Array,
    },
    ecoScoreTotal: Number,
    ecoScoreDetails: {
        acceleration: Number,
        constancy: Number,
        freeWheeling: Number
    },
    speedfenceAlerts: Number,
    geofenceAlerts: Boolean,
    speedfenceValue: { type: Number, default: 0 },
    geofenceValue: {
        latitude: { type: String, default: null },
        longitude: { type: String, default: null },
        radius: { type: String, default: null }
    },
    espAlerts: Number,
    kickdowns: Number,
    fullBreakings: Number,
    fuelAverage: Number,
    fuelTotal: Number,
    userId: { type: String, required: true}, /* the foreign key for the user as driver of a tour - default is 'guest' */
    vehicleId: { type: String, required: true} /* the foreign key for the vehicle, maybe vin (first data) is not really required  */
});

tourSchema.statics = {
    load: function(id, cb){
        this.findOne({_id: id}).exec(cb);
    }
};

//mongoose.model('Tour', tourSchema);
// the schema is useless so far
// we need to create a model using it
var Tour = mongoose.model('Tour', tourSchema);

// make this available to our users in our Node applications
module.exports = Tour;
