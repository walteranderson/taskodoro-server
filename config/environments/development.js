'use strict';

module.exports = {
    server: {
      ip: process.env.IP || 'localhost',
      port: process.env.PORT || 8000
    },
    database: {
      url: 'mongodb://localhost/express_dev'
    }
};
