
module.exports = function(app) {
  
  app.use('/api/tasks', require('./api/task'));
  app.use('/api/users', require('./api/user'));
  
  app.use('/auth', require('./auth'));
  
  app.use('/', function(req, res) {
    res.send('hello world');
  });
  
};