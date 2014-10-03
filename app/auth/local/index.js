var router   = require('express').Router(),
    passport = require('passport');
    

router.post('/', passport.authenticate('local', { session: false }), function(req, res) {
  res.json({ user: req.user, sucess: 'success!' });
});

module.exports = router;




// passport.authenticate('local', function(err, user, msg) {
//   var error = err || msg;
//   if (error) { res.json(401, error); }
//   if (!user) { res.json(401, { message: 'Something went wrong. Sorry.' }); }
//       
//   // TODO - send back express-jwt token, add helper method to auth.util
//   res.json('success');
// })(req, res, next);