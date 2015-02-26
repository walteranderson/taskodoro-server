/**
 * Express Configuration
 */

'use strict';

var express        = require('express'),
    favicon        = require('serve-favicon'),
    morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    passport       = require('passport'),
    config         = require('./environments');

module.exports = function(app) {
  var env = app.get('env');

  // so that I can run tests on a separate port
  app.set('port', config.server.port);
  app.set('domain', config.server.ip);

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride());
  app.use(passport.initialize());

  if (env === 'production') {
    app.use(express.static(config.root + 'public'));
    app.set('appPath', config.root + 'public');
  }

  if (env === 'development' || env === 'test') {
    app.use(express.static(config.root + 'client'));
    app.set('appPath', config.root + 'client');
  }

  if (env === 'development') {
    app.use(morgan('dev'));
  }

  // error handlers
  // figure out a better place to put these

  if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
              message: err.message,
              error: err
          });
      });
  }
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: {}
      });
  });

};
