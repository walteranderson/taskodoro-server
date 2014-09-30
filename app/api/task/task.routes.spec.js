var should = require('should'),
    request = require('supertest'),
    Task = require('./task.model'),
    app = require('../../../server');
    
describe('Task Routes', function() {
  
  it('should return a json array', function() {
    request(app)
      .get('/api/tasks')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) { return done(err); }
        res.body.should.be.instanceOf(Array);
      });
  });
  
  // it('should return a single task instance', function(done) {
  //   var id = '542a1fc46c0091663b8f6f07';
  //   
  //   request(app)
  //     .get('/api/tasks/' + id)
  //     .expect(200)
  //     .expect('Content-Type', /json/)
  //     .end(function(err, res) {
  //       if (err) { return done(err); }
  //       res.body.should.be.instanceOf(Object);
  //     });
  // });
  
});