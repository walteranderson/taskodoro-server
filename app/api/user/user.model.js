var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema;
    
var UserSchema = new Schema({
  local: {
    username: String,
    password: String
  }
});

// generate hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);