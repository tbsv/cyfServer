var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: { type: String, required: true},
    password: { type: String, required: true},
    name: { type: String, required: true},
    role: { type: String, required: true},
    speedfence: Number,
    geofence: String
});

userSchema.statics = {
    load: function(id, cb){
        this.findOne({userId: id}).exec(cb);
    }
};

//mongoose.model('User', UserSchema);
// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
