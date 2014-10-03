var Task = require('./task.model');

exports.index = function(req, res) {
  Task.find()
    .where('user').equals(req.user._id)
    .exec(function(err, tasks) {
      if (err) { return handleError(res, err); }

      res.json(tasks);
    });
};

exports.show = function(req, res) {
  Task.findById(req.params.id)
    .where('user').equals(req.user._id)
    .exec(function(err, task) {
      if (err) { return handleError(res, err); }
      if (!task) { return res.status(404); }

      res.json(task);
    });
};

exports.create = function(req, res) {
  var newTask = new Task(req.body);
  newTask.user = req.user._id;

  newTask.save(function(err, task) {
    if (err) { return handleError(res, err); }

    res.json(task);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
