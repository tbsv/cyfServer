var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var alertSchema = new Schema({
    _id: { type: String, required: true},
    route: {
        timestampStart: Date,
        timestampStop: Date,
    },
    type: { type: String, required: true},
    tourId: { type: String, required: true}, /* the foreign key for the tour which alerted */
    userId: { type: String, required: true}, /* the foreign key for the child who alerted */
    readStatusMaster: {type: Boolean, default: false},
    readStatusChild: {type: Boolean, default: false}
});

alertSchema.statics = {
    load: function(id, cb){
        this.findOne({_id: id}).exec(cb);
    }
};

var Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;