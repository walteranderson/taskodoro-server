// var routes = require('./app/routes/index');
// var users = require('./app/routes/users');
var tasks = require('./task/task.controller');

module.exports = function(app) {
  
  // app.use('/', routes);
  // app.use('/users', users);
  app.use('/tasks', tasks);
  
};