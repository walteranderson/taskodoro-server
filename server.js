// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express  = require('express'),
    mongoose = require('mongoose'),
    config   = require('./config/environments'),
    app      = express();

// connect to db
mongoose.connect(config.database.url);
mongoose.connection.on('error', function () {
  console.log('mongodb connection error');
});

require('./config/express')(app);
require('./app/routes')(app);

app.listen(config.server.port, function() {
  console.log('Express server listening on port ' + config.server.port);
});

exports = module.exports = app;
