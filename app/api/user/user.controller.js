var User = require('./user.model'),
    Task = require('../task/task.model');

exports.index = function(req, res) {
  User.find(function(err, users) {
    if (err) { handleError(err, res); }
    
    res.status(200).json(users);
  });
};

exports.show = function(req, res) {
  res.send('SHOW!!');
};

function handleError(err, res) {
  res.status(500).send(err);
}