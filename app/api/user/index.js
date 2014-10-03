var router     = require('express').Router(),
    controller = require('./user.controller'),
    auth       = require('../../auth/auth.util');

router
  .get('/', auth.ensureAuth(), controller.index)
  .get('/:id', auth.ensureAuth(), controller.show)
  .post('/create', controller.create);

module.exports = router;