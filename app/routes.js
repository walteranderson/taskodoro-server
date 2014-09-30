
module.exports = function(app) {
  app.use('/api/tasks', require('./api/task'));
};