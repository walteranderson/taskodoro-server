var router   = require('express').Router(),
    passport = require('passport'),
    auth     = require('../auth.util');

router.post('/', passport.authenticate('local', { session: false }), function(req, res) {
  var token = auth.signToken(req.user._id);
  res.status(200).json({ token: token });
});

module.exports = router;