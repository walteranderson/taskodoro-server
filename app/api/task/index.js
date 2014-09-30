var router = require('express').Router(),
    controller = require('./task.controller');

router
  .get('/', controller.index)
  .post('/', controller.create);

module.exports = router;