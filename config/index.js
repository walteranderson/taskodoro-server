var path = require('path');

var config = {
  
  development: {
    root: path.normalize(__dirname + '/../'),
    server: {
      ip: process.env.IP,
      port: process.env.PORT
    },
    database: {
      url: 'mongodb://localhost/express_dev'
    }
  },
  
  test: {
    root: path.normalize(__dirname + '/../'),
    server: {
      port: 8001
    },
    database: {
      url: 'mongodb://localhost/express_test'
    }
  },
  
  production: {
    root: path.normalize(__dirname + '/../'),
    server: {
      port: 8080
    },
    database: {
      url: 'mongodb://localhost/express'
    }
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
