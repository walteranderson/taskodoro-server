var should  = require('should'),
    request = require('supertest'),
    Task    = require('./task.model'),
    app     = require('../../app');

describe('Task API', function() {
  var loggedInUser;
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
  
  before(function(done) {});
  
  describe('GET /api/tasks/', function() {});
  
});
