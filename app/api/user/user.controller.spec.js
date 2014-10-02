var should  = require('should'),
    request = require('supertest'),
    User    = require('./user.model'),
    app     = require('../../../server');
    
    
describe('User Routes', function() {
  
  it('respond with 200', function(done) {
    request(app)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) { return done(err); }
        res.body.should.be.instanceOf(Array);
        done();
      });
  });
  
});