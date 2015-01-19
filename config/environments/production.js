'use strict';

module.exports = {
  server: {
    ip: process.env.IP || '0.0.0.0',
    port: process.env.PORT || 8080
  },
  database: {
    url: process.env.MONGOHQ_URL || 'mongodb://heroku:UNRpgq_cqwlygubgCoVlscVvI_c08KqbHdlU1wNYT_VoFxBHNSwWHMh4nr6CGMwZLTEaLXgn4xRA0heX_fBZ4g@linus.mongohq.com:10037/app30507526'
  }
};
