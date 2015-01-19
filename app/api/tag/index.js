'use strict';

var router     = require('express').Router(),
    controller = require('./tag.controller');

// All routes protected by auth
router
  .get('/', controller.index);

module.exports = router;
