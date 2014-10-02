var User          = require('../app/api/user/user.model'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    

module.exports = function() {
  
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({username: username  }, function(err, user) {
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