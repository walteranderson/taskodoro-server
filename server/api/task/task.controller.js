/**
 * GET     /tasks              ->  index
 * POST    /tasks              ->  create
 * GET     /tasks/:id          ->  show
 * PUT     /tasks/:id          ->  update
 * DELETE  /tasks/:id          ->  destroy
 */

'use strict';

var Task = require('./task.model'),
    _    = require('lodash');

/**
 * GET all tasks
 */
exports.index = function(req, res) {

  Task.find()
    .where('user').equals(req.user._id)
    .populate('stack')
    .exec(function(err, tasks) {
      if (err) return handleError(res, err);
      if (!tasks) return res.status(404).end();

      return res.json(tasks);
    });

};

/**
 * POST create task
 */
exports.create = function(req, res) {

  var newTask = new Task(req.body);
  newTask.user = req.user._id;

  newTask.save(function(err, task) {
    if (err) return handleError(res, err);

    return res.json(task);
  });

};

/**
 * GET show one task
 */
exports.show = function(req, res) {

  Task.findById(req.params.id)
    .where('user').equals(req.user._id)
    .populate('stack')
    .exec(function(err, task) {
      if (err) return handleError(res, err);
      if (!task) return res.status(404).end();

      return res.json(task);
    });

};

/**
 * PUT update task
 */
exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }

  Task.findById(req.params.id)
    .where('user').equals(req.user._id)
    .exec(function(err, task) {
      if (err) return handleError(err, res);
      if (!task) return res.status(404).end();

      // merge the task with the updated info
      var updated = _.merge(task, req.body);
      updated.save(function(err, task) {
        if (err) return handleError(err, res);

        res.json(task);
      });
    });

};

/**
 * DELETE task
 */
exports.destroy = function(req, res) {

  Task.findById(req.params.id)
    .exec(function(err, task) {
      if (err) return handleError(res, err);
      if (!task) return res.status(404).end();

      task.remove(function(err) {
        if (err) return handleError(res, err);
        return res.status(204).end();
      });
    });

};

function handleError(res, err) {
  return res.status(500).send(err);
}
