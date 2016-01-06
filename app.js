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


// BEGIN -------------------- Default Filling of DB ----------------------
//First: create a default user
var User = require('./models/user');
var newUser = new User({
    _id: 'ronald.henger@student.reutlingen-university.de',
    password: 'blub',
    name: 'Ronald',
    role: 'master',
    speedfence: 120,
    geofence: "weiss ich auch noch nicht, check maps.google-Api?"
});
// save the default user in DB
newUser.save(function(err) {
    if (err) throw err;
    var defaultUser = User.find({ name: 'Ronald' });
    console.log('User '+defaultUser+' created!');
});

//Second: create a default vehicle
var Vehicle = require('./models/vehicle');
var newVehicle = new Vehicle({
  _id: 'WDD2122061B140828',
  regTimestamp: new Date(),
  user_id: 'ronald.henger@student.reutlingen-university.de'
});
//save the defaut vehicle in DB
newVehicle.save(function (err) {
    if (err) throw err;
    var defaultVehicle = Vehicle.find({ _id: 'WDD2122061B140828' });
    console.log('Vehicle '+defaultVehicle+' created!');
});

//Third: create a tour for the vehicle above
var Tour = require('./models/tour');
var newTour = new Tour({
    vin: 'WDD2122061B140828',
    route: {
        timestampStart: new Date(),
        timestampStop: new Date(),
        routeDistance: 30,
        routeDuration: 25,
        drivenRoute: {
            gpsLatitude: [],
            gpsLongitude: []
        }
    },
    ecoScore: {
        accelaration: 45,
        breaking: 33,
        driving: 17
    },
    speedfenceAlerts: 7,
    geofenceAlerts: 3,
    espAlerts: 0,
    kickdowns: 1,
    fullBreakings: 4,
    fuelAverage: "9.3",
    user_id: 'ronald.henger@student.reutlingen-university.de',
    vehicle_id: 'WDD2122061B140828'
});
//save the defaut tour in DB
newTour.save(function (err) {
    if (err) throw err;
    var defaultTour = Tour.find({ vin: 'WDD2122061B140828' });
    console.log('Tour '+defaultTour +' created!');
});


// After Server-Run, the Collections have to be deleted manually
// Commmand for Mongo-DB-Console
// db.tours.remove({});
// db.users.remove({});
// db.vehicles.remove({});

// END -------------------- Default Filling of DB ----------------------

// TODO: @Tobias: siehe Comment darunter
// @Tobias: Ich denke wir müssen nicht die Fahrzeuge abfragen. Die Fahrzeuge oder besser gesagt das Fahrzeug müsste
// vom User schon vorher über die App registriert werden / also in der DB für die Datenabfrage auf
// ReAdi-Connect abgelegt werden.
// Ich habe den Aufruf der Methode und den Cronjob "CronJobVehicles" mal auskommentiert.
// WAS WIR ABER MACHEN MÜSSTEN: Wenn der USER ein Fahrzeug anlegt muss in ReADi-Connect einmal geschaut werden,
// ob das Fahrzeug in ReADi-Connect existiert.
// ---> TODO: create readiService.findRegisteredVehicle(vin)
// - wird das Fahrzeug nicht in ReADi-Connect gefunden, sollte der MasterUser das Fahrzeug nicht anlegen können.
// Update all vehicles (every 100sec)
// TODO: define interval - in production every 5 or 10 min would be meaningful - but I think it is not needed
//new CronJobVehicles('*/10 * * * * *', function() {
//  console.log('getAllVehicles from ReADiConnect...');
//  readiService.getAllVehicles();
//}, null, true, 'Europe/Berlin');

// TODO: @Tobias: siehe Comment darunter
// @Tobias: Ich änder mal die Abfrage auf 60 sec.
// Update all tours (every 60sec) TODO: define interval
//new CronJobTours('*/30 * * * * *', function() {
//  console.log('getAllTours from ReADiConnect...');
//  readiService.getAllTours();
//}, null, true, 'Europe/Berlin');

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
