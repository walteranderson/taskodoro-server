
module.exports = function(app) {
  
  app.use('/api/tasks', require('./api/task'));
  app.use('/api/users', require('./api/user'));
  
  app.use('/auth', require('./auth'));
  
  app.use('/login', function(req, res) {
    res.render('login', { title: 'Login Page' });
  });
  
  app.use('/', function(req, res) {
    res.render('index', { title: 'Index Page' });
  });
  
};