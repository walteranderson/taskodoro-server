var should  = require('should'),
    request = require('supertest'),
    User    = require('./user.model');

var newUser = new User({
  email: 'email@example.com',
  username: 'username',
  password: 'password'
});

describe('User Model', function() {

  // clear out the test db before starting
  before(function(done) {
    User.remove().exec().then(function() {
      done();
    });
  });

  // clear out the test db after each test
  afterEach(function(done) {
    User.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no users', function(done) {
    User.find().exec(function(err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail while saving duplicate users', function(done) {
    newUser.save(function() {
      var userDup = new User(newUser);

      userDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail with no username', function(done) {
    newUser.username = '';

    newUser.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should fail with no email', function(done) {
    newUser.email = '';

    newUser.save(function(err) {
      should.exist(err);
      done();
    });
  });


});
