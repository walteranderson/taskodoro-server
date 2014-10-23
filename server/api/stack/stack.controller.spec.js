var should  = require('should'),
    request = require('supertest'),
    Stack   = require('./stack.model'),
    User    = require('../user/user.model'),
    app     = require('../../app');

describe('Stack API', function() {
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

        Stack.remove().exec().then(function() {
          // login in and save the user token
          postValidCreds(done);
        });
      });
    });
  });

  // remove all users after all tests are run
  after(function(done) {
    User.remove().exec().then(function() {
      Stack.remove().exec().then(function() {
        done();
      });
    });
  });



  /**
   * Index
   */
  describe('GET /api/stacks/', function() {

    it('should respond with a 401 if not authenticated', function(done) {
      request(app)
        .get('/api/stacks')
        .expect(401)
        .end(done);
    });

    it('should respond with array of stacks when authenticated', function(done) {
      request(app)
        .get('/api/stacks')
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
  describe('POST /api/stacks/', function() {
    var newStack = {
      name: 'New Stack'
    };

    it('should return the created stack on create', function(done) {
      request(app)
        .post('/api/stacks')
        .set('authorization', 'Bearer ' + token)
        .send(newStack)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          res.body.name.should.equal(newStack.name);
          res.body.user.should.equal(loggedInUser._id.toString());
          done();
        });
    });

    // remove the created stack after testing for it
    after(function(done) {
      Stack.remove().exec().then(function() {
        done();
      });
    });

  });

  /**
   * Show
   */
  describe('GET /api/stacks/:id', function() {
    var newStack = {
      name: 'New Stack'
    };

    // insert a new stack before we test the route
    before(function(done) {
      request(app)
        .post('/api/stacks')
        .set('authorization', 'Bearer ' + token)
        .send(newStack)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          // set the created task to include its ID and user info
          newStack = res.body;
          done();
        });
    });

    it('should respond with a 401 if not authenticated', function(done) {
      request(app)
        .get('/api/stacks/' + newStack._id)
        .expect(401)
        .end(done);
    });

    it('should respond with the stack object', function(done) {
      request(app)
        .get('/api/stacks/' +newStack._id)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          should.exist(res.body);
          res.body.name.should.equal(newStack.name);
          done();
        });
    });

    // remove the stack after testing for it
    after(function(done) {
      Stack.remove().exec().then(function() {
        done();
      });
    });

  });

   /**
   * Update
   */
  describe('PUT /api/stacks/:id', function() {
    var newStack = {
      name: 'New Stack'
    };

    // add a new task for the logged in user
    // TODO - use Task model instead of api
    before(function(done) {
      request(app)
        .post('/api/stacks')
        .set('authorization', 'Bearer ' + token)
        .send(newStack)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          // set the created task to include its ID and user info
          newStack = res.body;
          done();
        });
    });

    it('should respond with a 401 if not authenticated', function(done) {
      request(app)
        .get('/api/stacks/' + newStack._id)
        .expect(401)
        .end(done);
    });

    it('should update the stack name', function(done) {
      var updatedStack = {
        name: 'Updated Name'
      };

      request(app)
        .put('/api/stacks/' + newStack._id)
        .send(updatedStack)
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          Stack.findById(res.body._id)
            .exec(function(err, stack) {
              if (err) return done(err);
              (stack === null).should.be.equal(false);

              stack.name.should.equal(updatedStack.name);
              done();
            });
        });
    });

    // remove the stack after testing for it
    after(function(done) {
      Stack.remove().exec().then(function() {
        done();
      });
    });

  });

   /**
   * Delete
   */
  describe('DELETE /api/stacks/:id', function() {

    before(function(done) {
      deleteStack = new Stack({
        name: 'Stack Name',
        user: loggedInUser._id
      });

      deleteStack.save(function(err, stack) {
        if (err) return done(err);
        done();
      });
    });

    it('should not exist after deleting', function(done) {
      request(app)
        .delete('/api/stacks/' + deleteStack._id)
        .set('authorization', 'Bearer ' + token)
        .expect(204)
        .end(function(err, res) {
          if (err) return done(err);

          Stack.findById(deleteStack._id)
            .exec(function(err, stack) {
              if (err) return done(err);

              should.not.exist(stack);
              done();
            });
        });
    });

    // remove the stack after testing for it
    after(function(done) {
      Stack.remove().exec().then(function() {
        done();
      });
    });

  });

});
