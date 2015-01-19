'use strict';

var path = require('path'),
    _    = require('lodash');

var all = {
  root: path.normalize(__dirname + '/../../'),
  secrets: {
    session: 'taskodoro-secret-token-special'
  },
  userRoles: ['user', 'admin']
};

// merge both arrays together
module.exports = _.merge(all, env[process.env.NODE_ENV || 'development']);
