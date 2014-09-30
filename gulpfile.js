var gulp = require('gulp'),
    nodemon = require('gulp-nodemon')
    jshint = require('gulp-jshint'),
    mocha  = require('gulp-mocha');
    
var paths = {
  server: ['server.js', 'config/**/*.js', 'app/**/*.js'],
  test: ['app/**/*.spec.js'],
}
    
gulp.task('server', function() {
  nodemon({ script: 'server.js' })
    .on('change', ['restart']);
});

gulp.task('lintserver', function() {
  gulp.src(paths.server)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function() {
  process.env.NODE_ENV = 'test';
  
  return gulp.src(paths.test)
    .pipe(mocha({ reporter: 'nyan' }))
    .once('end', function() { process.exit(); });
});

gulp.task('restart', ['lintserver']);

gulp.task('default', ['lintserver', 'server']);