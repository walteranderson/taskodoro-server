/**
 * Local Authentication Setup
 */

'use strict';

var passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


exports.setup = function(User) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function(email, password, done) {
      User.findOne({ 'email': email }, function(err, user) {
        if (err) { done(err); }
        if (!user) return done(null, false, { message: 'Incorrect email' });

        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      });
    }
  ));

};
