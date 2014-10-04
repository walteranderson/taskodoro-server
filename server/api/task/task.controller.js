var Task = require('./task.model'),
    _    = require('lodash');

exports.index = function(req, res) {

  Task.find()
    .where('user').equals(req.user._id)
    .exec(function(err, tasks) {
      if (err) return handleError(res, err);
      if (!tasks) return res.status(404);

      return res.json(tasks);
    });

};

exports.create = function(req, res) {

  var newTask = new Task(req.body);
  newTask.user = req.user._id;

  newTask.save(function(err, task) {
    if (err) return handleError(res, err);

    return res.json(task);
  });

};

exports.show = function(req, res) {

  Task.findById(req.params.id)
    .where('user').equals(req.user._id)
    .exec(function(err, task) {
      if (err) return handleError(res, err);
      if (!task) return res.status(404);

      return res.json(task);
    });

};

exports.update = function(req, res) {
  // TODO
};

exports.destroy = function(req, res) {

  Task.findById(req.params.id)
    .exec(function(err, task) {
      if (err) return handleError(res, err);
      if (!task) return res.status(404);

      task.remove(function(err) {
        if (err) return handleError(res, err);
        return res.status(204);
      });
    });

};

function handleError(res, err) {
  return res.status(500).send(err);
}
