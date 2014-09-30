var should = require('should'),
    request = require('supertest'),
    Task = require('./task.model'),
    app = require('../../server');
    
var task = new Task({
  text: 'random task',
  completed: false
});
    
describe('Task Routes', function() {
  it('should respond with 200', function(done) {
    request(app).get('/tasks').expect(200, done);
  });
});

describe('Task Model', function() {
  
  before(function() {
    Task.remove().exec().then(function() {
      done();
    });
  });
  
  afterEach(function() {
    Task.remove().exec().then(function() {
      done();
    });
  });
  
  it('should begin with no tasks', function(done) {
    Task.find({}, function(err, tasks) {
      tasks.should.have.length(0);
      done();
    });
  });
  
});