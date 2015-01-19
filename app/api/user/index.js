'use strict';

var router     = require('express').Router(),
    controller = require('./user.controller'),
    auth       = require('../../auth/auth.util');

router
  .get('/', auth.hasRole('admin'), controller.index)
  .post('/', controller.create)
  .get('/me', auth.check(), controller.me)
  .put('/:id/password', auth.check(), controller.changePassword)
  .get('/:id', auth.check(), controller.show)
  .delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
