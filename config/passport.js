var User          = require('../app/api/user/user.model'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    

module.exports = function() {
  
  passport.use('local-signup', new LocalStrategy(
    function(username, password, done) {
      User.findOne({ 'local.username': username }, function(err, user) {
        if (err) { done(err); }
        if (user) { return done(null, false, { message: 'Username already exists' }); }
        
        var newUser = new User();
        newUser.local.username = username;
        newUser.local.password = newUser.generateHash(password);
        
        newUser.save(function(err) {
          if (err) { done(err); }
          
          return done(null, newUser);
        });
      });
    }
  ));
  
  passport.use('local-login', new LocalStrategy(
    function(username, password, done) {
      User.findOne({ 'local.username': username }, function(err, user) {
        if (err) { done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password' });
        }
        
        return done(null, user);
      });
    }
  ));
  
};