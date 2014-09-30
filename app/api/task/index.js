var router = require('express').Router(),
    controller = require('./task.controller');

router
  .get('/', controller.index)
  .get('/:id', controller.show)
  .post('/', controller.create);

module.exports = router;