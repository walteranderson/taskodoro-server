var should = require('should'),
    request = require('supertest'),
    Task = require('./task.model');
    
var task = new Task({
  text: 'random task',
  completed: false
});

describe('Task Model', function() {
  
  // remove any tasks before running the tests
  before(function(done) {
    Task.remove().exec().then(function() {
      done();
    });
  });
  
  // remove tasks after running each test for a clean slate
  afterEach(function(done) {
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
  
  it('should fail while saving duplicate tasks', function(done) {
    task.save(function() {
      var taskDup = new Task(task);
      taskDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });
  
  it('should fail when saving without text', function(done) {
    task.text = '';
    task.save(function(err) {
      should.exist(err);
      done();
    });
  });
  
});