var User = require('./user.model');

exports.index = function(req, res) {
  User.find(function(err, users) {
    if (err) { handleError(err, res); }
    
    res.status(200).json(users);
  });
};

function handleError(err, res) {
  res.status(500).send(err);
}