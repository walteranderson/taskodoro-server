var Task = require('./task.model');

exports.index = function(req, res) {
  Task.find(function(err, tasks) {
    if (err) { return handleError(res, err); }

    res.status(200).json(tasks);
  });
};

exports.show = function(req, res) {
  Task.findById(req.params.id, function(err, task) {
    if (err) { return handleError(res, err); }
    if (!task) { return res.status(404); }

    res.status(200).json(task);
  });
};

exports.create = function(req, res) {
  var task = new Task(req.body);

  task.save(function(err, task) {
    if (err) { return handleError(res, err); }

    res.status(200).json(task);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
