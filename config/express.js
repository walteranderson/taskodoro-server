var express      = require('express'),
    favicon      = require('serve-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    passport     = require('passport'),
    config       = require('./environments');

module.exports = function(app) {
  app.set('port', config.server.port);
  app.set('domain', config.server.ip);

  // view engine setup
  app.set('views', config.root + 'app/views');
  app.set('view engine', 'jade');

  // app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(require('less-middleware')(config.root + 'public'));
  app.use(express.static(config.root + 'public'));

  // error handlers

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