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

    // before(postValidCreds);
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

    /*it('should remove the user from the database', function(done) {
      request(app)
        .delete('/api/users/' + deleteUser._id)
        // .set('authorization', 'Bearer ' + token)
        .end(function(err, res) {
          if (err) return done(err);

          res.should.have.status(204);
        });
        // .end(function(err, res) {
        //   if (err) return done(err);

        //   User.findById(deleteUser._id)
        //     .exec(function(err, user) {
        //       console.log(err);
        //       should.exist(err);
        //       done();
        //     });
        // });
    });*/

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
  describe('POST /api/users/:id/password', function() {});

});
