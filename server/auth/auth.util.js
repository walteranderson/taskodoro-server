var config      = require('../config/environments'),
    User        = require('../api/user/user.model'),
    jwt         = require('jsonwebtoken'),
    compose     = require('composable-middleware'),
    validateJwt = require('express-jwt')({ secret: config.secrets.session });

module.exports = {

  ensureAuth: function() {
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

  signToken: function(id) {
    return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
  }
};
