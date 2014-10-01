
module.exports = function(app) {
  app.use('/api/tasks', require('./api/task'));
  app.use('/api/users', require('./api/user'));
};