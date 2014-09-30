var should = require('should'),
    request = require('supertest'),
    app = require('../server');

describe('index page', function() {
  
  it('responds okay', function(done) {
    request(app).get('/').expect(200, done);
  });
  
});

describe('tasks page', function() {
  
  it('responds okay', function(done) {
    request(app).get('/tasks').expect(200, done);
  });
  
});