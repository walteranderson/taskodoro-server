var should  = require('should'),
    request = require('supertest'),
    User    = require('./user.model'),
    app     = require('../../app');

describe('User API', function() {
  var loggedInUser;
  var token;
  var loginUserData = {
    username: 'testUser',
    password: 'testPassword'
  };

  // Login and save token
  function postValidCreds(done) {
    request(app)
      .post('/auth/local')
      .send(loginUserData)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);

        token = res.body.token;
        done();
      });
  }

  // create a new user before tests are run
  before(function(done) {
    User.remove().exec().then(function() {
      loggedInUser = new User(loginUserData);

      loggedInUser.save(function(err) {
        if (err) return done(err);
        done();
      });
    });
  });

  // remove all users after all tests are run
  after(function(done) {
    User.remove().exec().then(function() {
      done();
    });
  });

  /**
   * Index
   */
  describe('GET /api/users/',function() {

    before(postValidCreds);

    it('should respond with a 401 if not authenticated', function(done) {
      request(app)
        .get('/api/users')
        .expect(401)
        .end(done);
    });

    it('should respond with array of users when authenticated', function(done) {
      request(app)
        .get('/api/users')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          Array.isArray(res.body).should.equal(true);
          done();
        });
    });

  });

  /**
   * Create
   */
  describe('POST /api/users/', function() {
    var newUser = {
      username: 'newUser',
      password: 'newPassword'
    };

    it('should return a token on create', function(done) {
      request(app)
        .post('/api/users')
        .send(newUser)
        .end(function(err, res) {
          if (err) return done(err);

          res.body.should.have.property('token');
          done();
        });
    });
  });

  /**
   * Show
   */
  describe('GET /api/users/:id', function() {

    before(postValidCreds);

    it('should respond with 401 if not authenticated', function(done) {
      request(app)
        .get('/api/users/' + loggedInUser._id)
        .expect(401)
        .end(done);
    });

    it('should respond with user info when authenticated', function(done) {
      request(app)
        .get('/api/users/' + loggedInUser._id)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          res.body._id.should.equal(loggedInUser._id.toString());
          done();
        });
    });
  });

  /**
   * Destroy
   */
   describe('DELETE /api/users/:id', function() {
    var deleteUser;

    before(postValidCreds);
    before(function(done) {
      deleteUser = new User({
        username: 'iWill',
        password: 'beDeleted'
      });
      deleteUser.save(function(err, user) {
        if (err) return done(err);
        done();
      });
    });

    it('should not exist after deleting', function(done) {
      request(app)
        .delete('/api/users/' + deleteUser._id)
        .set('authorization', 'Bearer ' + token)
        .end(function(err, res) {
          if (err) return done(err);

          User.findById(deleteUser._id)
            .exec(function(err, user) {

              should.not.exist(user);
              done();
            });
        });
    });

   });

  /**
   * Me
   */
  describe('GET /api/users/me', function() {

    before(postValidCreds);

    it('should respond with a 401 if not authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .expect(401)
        .end(done);
    });

    it('should respond with user information when authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          res.body._id.should.equal(loggedInUser._id.toString());
          done();
        });
    });
  });

  /**
   * Change Password
   */
  describe('POST /api/users/:id/password', function() {
    var newPasswordData;

    before(postValidCreds);

    // make sure the newPasswordData stays the same for each test
    beforeEach(function() {
      newPasswordData = {
        oldPassword: 'testPassword',
        newPassword: 'newPassword'
      };
    });

    it('should respond with a 401 if not authenticated', function(done) {
      request(app)
        .post('/api/users/' + loggedInUser._id + '/password')
        .expect(401)
        .end(done);
    });

    it('should respond with 403 if you give it the wrong old password', function(done) {
      newPasswordData.oldPassword = 'wrongPassword';

      request(app)
        .post('/api/users/' + loggedInUser._id + '/password')
        .set('authorization', 'Bearer ' + token)
        .send(newPasswordData)
        .expect(403)
        .end(done);
    });

    it('should successfully change the password', function(done) {
      request(app)
        .post('/api/users/' + loggedInUser._id + '/password')
        .set('authorization', 'Bearer ' + token)
        .send(newPasswordData)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          User.findById(loggedInUser._id)
            .exec(function(err, user) {
              if (err) return done(err);

              user.validPassword(newPasswordData.newPassword).should.equal(true);
              done();
            });
        });
    });

  });

});
