var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var jwt = require('jwt-simple');
var db = require('./models/db');
var users = require('./routes/users');
var vehicles = require('./routes/vehicles');
var tours = require('./routes/tours');
var alerts = require('./routes/alerts');
var readiService = require('./services/readiService');
// var CronJobVehicles = require('cron').CronJob;
// var CronJobTours = require('cron').CronJob;

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// AUTHENTICATION with PASSPORT.JS
app.use(passport.initialize());

// ROUTES for REST API
app.use('/users', users);
app.use('/vehicles', vehicles);
app.use('/tours', tours);
app.use('/alerts', alerts);

// BEGIN -------------------- CronJobs for ReADi ----------------------

readiService.getAllTours();

// Update all vehicles (every 100sec) TODO: define interval
//new CronJobVehicles('*/10 * * * * *', function() {
//  console.log('getAllVehicles from ReADiConnect...');
//  readiService.getAllVehicles();
//}, null, true, 'Europe/Berlin');

// Update all tours (every 60sec) TODO: define interval
//new CronJobTours('*/30 * * * * *', function() {
//  console.log('getAllTours from ReADiConnect...');
//  readiService.getAllTours();
//}, null, true, 'Europe/Berlin');

// END ---------------------- CronJobs for ReADi ----------------------

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
