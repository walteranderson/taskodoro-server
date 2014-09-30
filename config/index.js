var path = require('path');

var config = {
  
  development: {
    root: path.normalize(__dirname + '/../'),
    server: {
      port: 3000,
    },
    database: {
      url: 'mongodb://localhost/express_dev'
    }
  },
  
  testing: {
    root: path.normalize(__dirname + '/../'),
    server: {
      port: 3001
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
