var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cyf');
var db = mongoose.connection;

// MongoDB connection logs
db.on('error', function callback(){
    console.log("Connection to database failed")
});
db.once('open', function callback(){
    console.log("Connection to database established")
});
