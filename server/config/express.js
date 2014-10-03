var express      = require('express'),
    favicon      = require('serve-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    passport     = require('passport'),
    config       = require('./environments');

module.exports = function(app) {
  // so that I can run tests on a separate port
  // and so c9 doesn't freak out
  app.set('port', config.server.port);
  app.set('domain', config.server.ip);

  // view engine setup
  // necessary for api?
  app.set('views', config.root + 'server/views');
  app.set('view engine', 'jade');

  // app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // cookieParse probably not necessary
  app.use(cookieParser());
  app.use(passport.initialize());

  // compile less
  app.use(require('less-middleware')(config.root + 'public'));

  // serve assets stored in the public folder
  app.use(express.static(config.root + 'public'));


  // error handlers
  // maybe try to move these to routes?

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
