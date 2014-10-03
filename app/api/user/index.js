var router     = require('express').Router(),
    controller = require('./user.controller'),
    auth       = require('../../auth/auth.util');

router
  .get('/', auth.ensureAuthentication(), controller.index)
  .get('/:id', auth.ensureAuthentication(), controller.show)
  .post('/create', controller.create);

module.exports = router;