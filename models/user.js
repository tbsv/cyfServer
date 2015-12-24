var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    userId:    String,
    name: String
});

UserSchema.statics = {
    load: function(id, cb){
        this.findOne({userId: id}).exec(cb);
    }
};

mongoose.model('User', UserSchema);
