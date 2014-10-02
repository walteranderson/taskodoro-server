var router     = require('express').Router(),
    controller = require('./user.controller');

router
  .get('/', controller.index);

module.exports = router;