/**
 * Main Application Routes
 */

'use strict';

var auth = require('./auth/auth.util');

module.exports = function(app) {

  // API Routes
  app.use('/api/tasks', auth.check(), require('./api/task'));
  app.use('/api/tags', auth.check(), require('./api/tag'));
  app.use('/api/users', require('./api/user'));

  // Authentication Routes
  app.use('/auth', require('./auth'));

  // Otherwise redirect to index.html
  app.route('/*').get(function(req, res) {
      res.status(404).send();
  });
};
