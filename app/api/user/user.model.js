var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs'),
    Schema   = mongoose.Schema;

var UserSchema = new Schema({
  local: {
    username: String,
    password: {
      type: String,
      select: false
    }
  }
});

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isNew) return next();

  var hash = user.generateHash(user.local.password);
  user.local.password = hash;
  next();
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
