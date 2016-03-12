var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    _id: { type: String, required: true},
    password: { type: String, required: true},
    name: {
        first: String,
        last: String
    },
    vin: String,
    role: { type: String, default: "guest"},
    updated: { type: Date, default: Date.now },
    geofence: {
        latitude: { type: String, default: "48.67965" },
        longitude: { type: String, default: "8.998960" },
        radius: { type: String, default: "500" }
    },
    speedfence: { type: Number, default: 0 },
    geofenceActive: {type: Boolean, default: false},
    speedfenceActive: {type: Boolean, default: false},
    termsOfUseAgreed: {type: Boolean, default: false}
});

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.statics = {
    load: function(id, cb){
        this.findOne({_id: id}).exec(cb);
    }
};

userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
