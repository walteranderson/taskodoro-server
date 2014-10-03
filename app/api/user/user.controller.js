var auth = require('../../auth/auth.util'),
    User = require('./user.model');

exports.index = function(req, res) {
  User.find(function(err, users) {
    if (err) { handleError(err, res); }
    
    res.status(200).json(users);
  });
};

exports.show = function(req, res) {
  res.send('SHOW!!');
};

exports.create = function(req, res) {
  var newUser = new User();
  newUser.local = req.body;
  
  newUser.save(function(err, user) {
    if (err) handleError(err, res);
    
    var token = auth.signToken(user._id);
    res.status(200).json({ token: token });
  });
};

function handleError(err, res) {
  res.status(500).send(err);
}