var router = require('express').Router();

router.get('/', function(req, res) {
  res.render('tasks', { title: 'Tasks' });
});

module.exports = router;