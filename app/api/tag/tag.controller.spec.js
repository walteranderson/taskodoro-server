/*jshint expr: true*/

var should  = require('should'),
    assert  = require('assert'),
    request = require('supertest'),
    Task    = require('../task/task.model'),
    User    = require('../user/user.model'),
    app     = require('../../app');

describe('Tag API', function() {
  var loggedInUser;
  var token;
  var loginUserData = {
      email: 'email@example.com',
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

        Task.remove().exec().then(function() {
          // login in and save the user token
          postValidCreds(done);
        });
      });
    });
  });

  // remove all users after all tests are run
  after(function(done) {
    User.remove().exec().then(function() {
      Task.remove().exec().then(function() {
        done();
      });
    });
  });



  /**
   * Index
   */
  describe('GET /api/tags', function() {
    var task = {
      name: 'testing testing',
      tags: ['thing1', 'thing2', 'thing3']
    };

    before(function(done) {
      request(app)
        .post('/api/tasks')
        .set('authorization', 'Bearer ' + token)
        .send(task)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          // set the created task to include its ID and user info
          task = res.body;
          done();
        });
    });

    it('should respond with a 401 if not authenticated', function(done) {
      request(app)
        .get('/api/tags')
        .expect(401)
        .end(done);
    });

    it('when authenticated, it should respond with an array of all tags used by user', function(done) {
      request(app)
        .get('/api/tags')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          res.body.should.be.an.Array;
          assert.deepEqual(task.tags, res.body);
          done();
        });
    });

    it('when auth\'d, it should return an array of tasks that have the tag that was provided', function(done) {
      var tag = 'thing1';
      request(app)
        .get('/api/tags?q=' + tag)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          res.body.should.be.an.Array;

          var actual = [task];
          assert.deepEqual(actual, res.body);
          done();
        });
    });

  });
});
