var router     = require('express').Router(),
    controller = require('./user.controller'),
    auth       = require('../../auth/auth.util');

router
  .get('/', auth.ensureAuth(), controller.index)
  .post('/', controller.create)
  .get('/me', auth.ensureAuth(), controller.me)
  .post('/:id/password', auth.ensureAuth(), controller.changePassword)
  .get('/:id', auth.ensureAuth(), controller.show)
  .delete('/:id', auth.ensureAuth(), controller.destroy);

module.exports = router;
