/**
 * GET     /tags       ->  index
 */

'use strict';

var Task = require('../task/task.model'),
    _    = require('lodash');

exports.index = function(req, res) {
  var q = getQuery(req);

  // search with provided query
  if (q) return searchQuery(req, res, q);

  // search for all tags
  Task.find({ tags: { $exists: true, $not: { $size: 0 } } })
    .distinct('tags')
    .where('completed').equals(false)
    .exec(function(err, tags) {
      if (err) return handleError(res, err);
      if (!tags) return res.status(404).end();

      return res.json(tags);
    });
};

/**
 * searchQuery
 * returns all tasks from a user if they contain a tag
 * in the query array
 */
function searchQuery(req, res, q) {
  // todo
  return null;
}

/**
 * getQuery
 * returns an array of tags to query
 * returns false if no query string
 */
function getQuery(req) {
  // handle searching by query string
  if (!req.query.q) return false;
  return req.query.q.split(',');
}

/**
 * handleError
 * returns status of 500 with the error message
 */
function handleError(res, err) {
  return res.status(500).send(err);
}
