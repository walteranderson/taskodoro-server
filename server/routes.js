'use strict';

var auth = require('./auth/auth.util');

module.exports = function(app) {
  app.use('/api/tasks', auth.ensureAuth(), require('./api/task'));
  app.use('/api/users', require('./api/user'));
  app.use('/auth', require('./auth'));

  // All other routes should redirect to the index.html
  app.route('/*').get(function(req, res) {
      res.sendFile(app.get('appPath') + '/index.html');
  });
};
