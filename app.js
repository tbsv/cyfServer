var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var vehicles = require('./routes/vehicles');

var app = express();

// MongoDB connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cyf');
var db = mongoose.connection;

// MongoDB logs
db.on('error', function callback(){
  console.log("Connection to database failed")
});
db.once('open', function callback(){
  console.log("Connection to database established")
});

// MongoDB collection
var collection = db.collection('vehicles');

// ReADi-Connect calls (with unirest)
var unirest = require('unirest');

unirest.get('http://readi.mi.hdm-stuttgart.de/exist/apps/readi/vehicles')
    .header('Accept', 'application/json')
    .end(function (response) {
      var data = JSON.parse(response.body);
      var vehicles = data[0].VINS;
      for (var vehicle in vehicles) {

        console.log(vehicles[vehicle]);

        collection.count({vin: vehicles[vehicle]}, function(err, count) {
          if( count > 0 ) {
            console.log(vehicles[vehicle] + " already exists");
          } else {
            collection.insert({vin: vehicles[vehicle]});
            console.log(vehicles[vehicle] + " added to db");
          }
        })

      }
    });

/*
// ReADi-Connect calls (with node-rest-client)
var Client = require('node-rest-client').Client;

var client = new Client();

var mongoose = require('mongoose');
var Vehicle = mongoose.model("Vehicle");

// registering remote methods
client.registerMethod("jsonMethod", "http://readi.mi.hdm-stuttgart.de/exist/apps/readi/vehicles", "GET");

client.methods.jsonMethod(function(data,response){
  var json = data;
  // parsed response body as js object
  var obj = JSON.parse(data.toString());

  for(var VINS in obj){
    console.log(obj[VINS]);
  }

  //console.log(obj[0].VINS);
  // raw response
  //console.log(response);
});
*/

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', users);
app.use('/vehicles', vehicles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
