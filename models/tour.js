var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TourSchema = new Schema({
    vin:    String,
    timestamp: String
});

TourSchema.statics = {
    load: function(id, cb){
        this.findOne({timestamp: id}).exec(cb);
    }
};

mongoose.model('Tour', TourSchema);
