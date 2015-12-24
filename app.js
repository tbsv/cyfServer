var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./models/db');
var users = require('./routes/users');
var vehicles = require('./routes/vehicles');
var tours = require('./routes/tours');
var readiService = require('./services/readiService');
var CronJobVehicles = require('cron').CronJob;
var CronJobTours = require('cron').CronJob;

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', users);
app.use('/vehicles', vehicles);
app.use('/tours', tours);

// Update all vehicles (every 10sec) TODO: define interval
new CronJobVehicles('*/10 * * * * *', function() {
  console.log('getAllVehicles from ReADiConnect...');
  readiService.getAllVehicles();
}, null, true, 'Europe/Berlin');

// Update all tours (every 30sec) TODO: define interval
new CronJobTours('*/30 * * * * *', function() {
  console.log('getAllTours from ReADiConnect...');
  readiService.getAllTours();
}, null, true, 'Europe/Berlin');

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
