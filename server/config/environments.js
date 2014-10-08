var path = require('path'),
    _    = require('lodash');

var all = {
  root: path.normalize(__dirname + '/../../'),
  secrets: {
    session: 'taskodoro-secret-token-special'
  }
};

var config = {

  development: {
    server: {
      ip: process.env.IP || 'localhost',
      port: process.env.PORT || 8000
    },
    database: {
      url: 'mongodb://localhost/express_dev'
    }
  },
  test: {
    server: {
      ip: process.env.IP || 'localhost',
      port: process.env.PORT || 8001
    },
    database: {
      url: 'mongodb://localhost/express_test'
    }
  },
  production: {
    server: {
      port: 8080
    },
    database: {
      url: process.env.MONGOHQ_URL || 'mongodb://admin:mongohqQCqv93@linus.mongohq.com:10037/app30507526'
    }
  }

};

module.exports = _.merge(all, config[process.env.NODE_ENV || 'development']);
