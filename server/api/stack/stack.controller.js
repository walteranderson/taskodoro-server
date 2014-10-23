'use strict';

var Stack = require('./stack.model'),
    _     = require('lodash');

/**
 * GET all stacks
 */
exports.index = function(req, res) {

  Stack.find()
    .where('user').equals(req.user._id)
    .exec(function(err, stacks) {
      if (err) return handleError(res, err);
      if (!stacks) return res.status(404).end();

      return res.json(stacks);
    });

};

/**
 * POST create stack
 */
exports.create = function(req, res) {

  var newStack = new Stack(req.body);
  newStack.user = req.user._id;

  newStack.save(function(err, stack) {
    if (err) return handleError(res, err);

    return res.json(stack);
  });

};

/**
 * GET show one stack
 */
exports.show = function(req, res) {

  Stack.findById(req.params.id)
    .where('user').equals(req.user._id)
    .exec(function(err, stack) {
      if (err) return handleError(res, err);
      if (!stack) return res.status(404).end();

      return res.json(stack);
    });

};

/**
 * PUT update stack
 */
exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }

  Stack.findById(req.params.id)
    .where('user').equals(req.user._id)
    .exec(function(err, stack) {
      if (err) return handleError(err, res);
      if (!stack) return res.status(404).end();

      // merge the stack with the updated info
      var updated = _.merge(stack, req.body);
      updated.save(function(err, stack) {
        if (err) return handleError(err, res);

        res.json(stack);
      });
    });

};

/**
 * DELETE stack
 */
exports.destroy = function(req, res) {
  Stack.findById(req.params.id)
    .exec(function(err, stack) {
      if (err) return handleError(res, err);
      if (!stack) return res.status(404).end();

      stack.remove(function(err) {
        if (err) return handleError(res, err);

        return res.status(204).end();
      });
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
