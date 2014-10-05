/**
 * GET     /users              ->  index
 * POST    /users              ->  create
 * GET     /users/me           ->  get logged in user
 * GET     /users/:id          ->  show
 * POST    /users/:id/password ->  change password
 * DELETE  /users/:id          ->  destroy
 */

var auth = require('../../auth/auth.util'),
    User = require('./user.model');

/**
 * GET all users
 */
exports.index = function(req, res) {

  User.find()
    .exec(function(err, users) {
      if (err) return handleError(err, res);
      if (!users) return res.status(404);

      return res.json(users);
    });

};

/**
 * POST new user
 */
exports.create = function(req, res) {
  var newUser = new User(req.body);

  newUser.save(function(err, user) {
    if (err) return handleError(err, res);

    var token = auth.signToken(user._id);
    return res.json({ token: token });
  });

};

/**
 * GET one user
 * params: id
 */
exports.show = function(req, res) {
  var userId = req.params.id;

  User.findById(userId)
    .exec(function(err, user) {
      if (err) return handleError(err, res);
      if (!user) return res.status(404);

      return res.json(user);
    });

};

/**
 * DELETE a user
 * params: id
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id)
    .exec(function(err) {
      if (err) return handleError(res, err);

      return res.status(204);
    });

};

/**
 * GET logged in user
 */
exports.me = function(req, res) {
  var userId = req.user._id;

  User.findById(userId)
    .exec(function(err, user) {
      if (err) return handleError(err, res);
      if (!user) return res.status(404);

      res.json(user);
    });

};

/**
 * POST change password
 */
exports.changePassword = function(req, res) {
  var userId  = req.user._id,
      oldPass = String(req.body.oldPassword),
      newPass = String(req.body.newPassword);

  User.findById(userId)
    .exec(function(err, user) {
      if(!user.validPassword) return res.status(403);

      user.password = newPass;
      user.save(function(err) {
        if (err) return handleError(err, res);

        return res.status(200);
      });
    });

};

function handleError(err, res) {
  res.status(500).send(err);
}
