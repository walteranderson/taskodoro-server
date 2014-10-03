var router     = require('express').Router(),
    controller = require('./task.controller'),
    auth       = require('../../auth/auth.util');

router
  .get('/', auth.ensureAuth(), controller.index)
  .get('/:id', auth.ensureAuth(), controller.show)
  .post('/', auth.ensureAuth(), controller.create);

module.exports = router;