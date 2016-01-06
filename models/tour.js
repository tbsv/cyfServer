var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tourSchema = new Schema({
    vin: { type: String, required: true},
    route: {
        timestampStart: Date,
        timestampStop: Date,
        routeDistance: Number,
        routeDuration: Number,
        drivenRoute: {
            gpsLatitude: Array,
            gpsLongitude: Array
        }
    },
    ecoScore: {
        accelaration: Number,
        breaking: Number,
        driving: Number
    },
    speedfenceAlerts: Number,
    geofenceAlerts: Number,
    espAlerts: Number,
    kickdowns: Number,
    fullBreakings: Number,
    fuelAverage: Number,
    user_id: String, /* the foreign key for the user as driver of a tour - default is 'guest' */
    vehicle_id: String /* the foreign key for the vehicle, maybe vin (first data) is not really required  */

});

tourSchema.statics = {
    load: function(id, cb){
        this.findOne({timestamp: id}).exec(cb);
    }
};

//mongoose.model('Tour', tourSchema);
// the schema is useless so far
// we need to create a model using it
var Tour = mongoose.model('Tour', tourSchema);

// make this available to our users in our Node applications
module.exports = Tour;
