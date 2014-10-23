'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var TaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: String,
    ref: 'User',
    required: true
  },
  stack: {
    type: Schema.Types.ObjectId,
    ref: 'Stack'
  }
});

module.exports = mongoose.model('Task', TaskSchema);
