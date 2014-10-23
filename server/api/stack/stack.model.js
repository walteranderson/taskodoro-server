'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var StackSchema = new Schema({
  name: {
    type: String,
    default: 'Inbox'
  },
  user: {
    type: String,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Stack', StackSchema);
