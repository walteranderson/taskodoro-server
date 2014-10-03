var router   = require('express').Router(),
    passport = require('passport');
    

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, msg) {
    var error = err || msg;
    if (error) { res.status(401).json(error); }
    if (!user) { res.status(401).json({ message: 'Something went wrong. Sorry.' }); }
        
    // TODO - send back express-jwt token, add helper method to auth.util
    res.status(200).json('success');
  });
});

module.exports = router;