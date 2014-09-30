// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

// connect to db
mongoose.connect(config.database.url);
mongoose.connection.on('error', function () {
  console.log('mongodb connection error');
});

var app = express();

require('./config/express')(app);

var routes = require('./app/routes/index');
var users = require('./app/routes/users');

app.use('/', routes);
app.use('/users', users);

app.listen(config.server.port, function() {
  console.log('Express server listening on port ' + config.server.port);
});

exports = module.exports = app;
