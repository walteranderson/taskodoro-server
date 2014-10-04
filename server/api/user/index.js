var router     = require('express').Router(),
    controller = require('./user.controller'),
    auth       = require('../../auth/auth.util');

router
  .get('/', auth.ensureAuth(), controller.index)
  .get('/me', auth.ensureAuth(), controller.me)
  .get('/:id', auth.ensureAuth(), controller.show)
  .post('/password', auth.ensureAuth(), controller.changePassword)
  .post('/create', controller.create)
  .delete('/:id', controller.destroy);

module.exports = router;
