var path = require('path');

var config = {

  development: {
    root: path.normalize(__dirname + '/../../'),
    secrets: {
      session: 'taskodoro-secret-token-special'
    },
    server: {
      ip: process.env.IP || 'localhost',
      port: process.env.PORT || 8000
    },
    database: {
      url: 'mongodb://localhost/express_dev'
    }
  },

  test: {
    root: path.normalize(__dirname + '/../../'),
    secrets: {
      session: 'taskodoro-secret-token-special'
    },
    server: {
      ip: process.env.IP || 'localhost',
      port: process.env.PORT || 8001
    },
    database: {
      url: 'mongodb://localhost/express_test'
    }
  },

  production: {
    root: path.normalize(__dirname + '/../../'),
    secrets: {
      session: 'taskodoro-secret-token-special'
    },
    server: {
      port: 8080
    },
    database: {
      url: 'mongodb://localhost/express'
    }
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
