var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  completed: Boolean
});

module.exports = mongoose.model('Task', TaskSchema);