var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
    
var UserSchema = new Schema({
  username: String,
  password: {
    type: String,
    select: false
  }
});

module.exports = mongoose.model('User', UserSchema);