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
      name: 'new task'
    };

    it('should return the created task on create', function(done) {
      request(app)
        .post('/api/tasks')
        .set('authorization', 'Bearer ' + token)
        .send(newTask)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          res.body.name.should.equal(newTask.name);
          res.body.user.should.equal(loggedInUser._id.toString());
          done();
        });
    });

    // remove the task after testing for it
    after(function(done) {
      Task.remove().exec().then(function() {
        done();
      });
    });

  });

  /**
   * Show
   */
  describe('GET /api/tasks/:id', function() {
    var task = {
      name: 'new task'
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
          res.body.name.should.equal(task.name);
          done();
        });
    });

    // remove the task after testing for it
    after(function(done) {
      Task.remove().exec().then(function() {
        done();
      });
    });

  });

  /**
   * Update
   */
  describe('PUT /api/tasks/:id', function() {
    var task = {
      name: 'new task'
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

    it('should update the task name', function(done) {
      var newTask = {
        name: 'updated'
      };

      request(app)
        .put('/api/tasks/' + task._id)
        .send(newTask)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          Task.findById(res.body._id)
            .exec(function(err, task) {
              if (err) return done(err);
              (task === null).should.be.equal(false);

              task.name.should.equal(newTask.name);
              done();
            });
        });
    });

    // remove the task after testing for it
    after(function(done) {
      Task.remove().exec().then(function() {
        done();
      });
    });

  });

  /**
   * Delete
   */
  describe('DELETE /api/tasks/:id', function() {
    var deleteTask;

    before(function(done) {
      deleteTask = new Task({
        name: 'task',
        user: loggedInUser._id
      });

      deleteTask.save(function(err, task) {
        if (err) return done(err);
        done();
      });
    });

    it('should not exist after deleting', function(done) {
      request(app)
        .delete('/api/tasks/' + deleteTask._id)
        .set('authorization', 'Bearer ' + token)
        .expect(204)
        .end(function(err, res) {
          if (err) return done(err);

          Task.findById(deleteTask._id)
            .exec(function(err, task) {
              if (err) return done(err);

              should.not.exist(task);
              done();
            });
        });
    });

    // remove the task after testing for it
    after(function(done) {
      Task.remove().exec().then(function() {
        done();
      });
    });

  });

});
