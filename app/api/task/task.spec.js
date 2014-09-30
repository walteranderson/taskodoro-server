var should = require('should'),
    request = require('supertest'),
    Task = require('./task.model'),
    app = require('../../../server');
    
var task = new Task({
  text: 'random task',
  completed: false
});
    
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
  
  it('should return a single task instance', function(done) {
    var id = '542a1fc46c0091663b8f6f07';
    
    request(app)
      .get('/api/tasks/' + id)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) { return done(err); }
        res.body.should.be.instanceOf(Object);
      });
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
  
  it('should fail while saving duplicate users', function(done) {
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