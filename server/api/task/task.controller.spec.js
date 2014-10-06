var should  = require('should'),
    request = require('supertest'),
    Task    = require('./task.model'),
    User    = require('../user/user.model'),
    app     = require('../../app');

describe('Task API', function() {
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

        // login in and save the user token
        postValidCreds(done);
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
  describe('GET /api/tasks/', function() {

    it('should respond with a 401 if not authenticated', function(done) {
      request(app)
        .get('/api/tasks')
        .expect(401)
        .end(done);
    });

    it('should respond with array of tasks when authenticated', function(done) {
      request(app)
        .get('/api/tasks')
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
  describe('POST /api/tasks/', function() {
    var newTask = {
      text: 'new task'
    };

    it('should return the created task on create', function(done) {
      request(app)
        .post('/api/tasks')
        .set('authorization', 'Bearer ' + token)
        .send(newTask)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          res.body.text.should.equal(newTask.text);
          res.body.user.should.equal(loggedInUser._id.toString());
          done();
        });
    });

  });

  /**
   * Show
   */
  describe('GET /api/tasks/:id', function() {
    var task = {
      text: 'new task'
    };

    // add a new task for the logged in user
    // TODO - use Task model instead of api
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
        .get('/api/tasks/' + task._id)
        .expect(401)
        .end(done);
    });

    it('should respond with the task object', function(done) {
      request(app)
        .get('/api/tasks/' +task._id)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          should.exist(res.body);
          res.body.text.should.equal(task.text);
          done();
        });
    });

  });

  /**
   * Update
   */
  describe('PUT /api/tasks/:id', function() {});

  /**
   * Delete
   */
  describe('DELETE /api/tasks/:id', function() {});

});
