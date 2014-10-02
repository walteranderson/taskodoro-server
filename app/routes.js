
module.exports = function(app) {
  app.use('/api/tasks', ensureAuthentication, require('./api/task'));
  app.use('/api/users', require('./api/user'));
  
  function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    }
    res.status(401);
  }
};