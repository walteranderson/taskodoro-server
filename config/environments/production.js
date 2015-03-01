'use strict';

module.exports = {
  server: {
    ip: process.env.IP || '0.0.0.0',
    port: process.env.PORT || 8080
  },
  database: {
    url: process.env.MONGOHQ_URL
  }
};
