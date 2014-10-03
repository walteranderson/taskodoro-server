var router     = require('express').Router(),
    controller = require('./user.controller'),
    auth       = require('../../auth/auth.util');

router
  .get('/', controller.index)
  .get('/:id', auth.ensureAuthentication, controller.show);

module.exports = router;