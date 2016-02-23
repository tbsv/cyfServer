var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var alertSchema = new Schema({
    _id: { type: String, required: true},
    regTimestamp: { type: Date, required: true},
    userId: { type: String, required: true}
});

alertSchema.statics = {
    load: function(id, cb){
        this.findOne({_id: id}).exec(cb);
    }
};

var Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;