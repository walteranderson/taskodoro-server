var router     = require('express').Router(),
    controller = require('./task.controller');

// All routes protected by auth
router
  .get('/', controller.index)
  .get('/:id', controller.show)
  .post('/', controller.create)
  .put('/:id', controller.update)
  .delete('/:id', controller.destroy);

module.exports = router;
