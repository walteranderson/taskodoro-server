var auth = require('../../auth/auth.util'),
    User = require('./user.model');

exports.index = function(req, res) {
  User.find(function(err, users) {
    if (err) return handleError(err, res);

    res.json(users);
  });
};

exports.show = function(req, res) {
  var userId = req.params.id;

  User.findById(userId, function(err, user) {
    if (err) return handleError(err, res);
    if (!user) return res.status(404);

    res.json(user);
  });
};

exports.create = function(req, res) {
  var newUser = new User();
  newUser.local = req.body;

  newUser.save(function(err, user) {
    if (err) return handleError(err, res);

    var token = auth.signToken(user._id);
    res.json({ token: token });
  });
};

exports.me = function(req, res) {
  var userId = req.user._id;

  User.findById(userId, function(err, user) {
    if (err) return handleError(err, res);
    if (!user) return res.status(404);

    res.json(user);
  });
};

function handleError(err, res) {
  res.status(500).send(err);
}
