/**
 * Authentication Utility Methods
 */

'use strict';

var config      = require('../../config/environments'),
    User        = require('../api/user/user.model'),
    jwt         = require('jsonwebtoken'),
    compose     = require('composable-middleware'),
    validateJwt = require('express-jwt')({ secret: config.secrets.session });

module.exports = {

  /**
   * Confirm the user is logged in
   */
  check: function() {
    return compose()

      // validate JWT first
      .use(function(req, res, next) {
        // allow access_token as url parameter to be used
        // if not, Authorization header must be set to 'Bearer ' + token
        if (req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = 'Bearer ' + req.query.access_token;
        }

        validateJwt(req, res, next);
      })

      // inject user instance into the request
      .use(function(req, res, next) {
        User.findById(req.user._id, function(err, user) {
          if (err) return next(err);
          if (!user) return res.send(401);

          req.user = user;
          next();
        });
      });
  },

  /*
   * Compare the logged in user's role to what is required
   */
  hasRole: function(roleRequired) {
    if (!roleRequired) { throw new Error('Required role needs to be set.'); }

    return compose()

      // authenticate the user first
      .use(this.check())

      // Confirm the user's role meets the requirement
      .use(function(req, res, next) {
        if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
          next();
        } else {
          res.status(403).end();
        }
      });
  },

  /*
   * Return jwt token signed by the app secret
   */
  signToken: function(id) {
    return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
  }
};
