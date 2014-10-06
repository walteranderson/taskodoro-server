var gulp     = require('gulp'),
    nodemon  = require('gulp-nodemon'),
    jshint   = require('gulp-jshint'),
    mocha    = require('gulp-mocha'),
    istanbul = require('gulp-istanbul');

var paths = {
  server: ['app.js', 'config/**/*.js', 'server/**/*.js'],
  test: ['server/**/*.spec.js'],
};

gulp.task('server', function() {
  nodemon({ script: 'server/app.js' })
    .on('change', ['restart']);
});

gulp.task('lint', function() {
  return gulp.src(paths.server)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function() {
  process.env.NODE_ENV = 'test';

  return gulp.src(paths.test)
    .pipe(mocha({ reporter: 'spec' }))
    .once('end', function() { process.exit(); });
});

gulp.task('coverage', function(done) {
  process.env.NODE_ENV = 'test';
  
  gulp.src(paths.server)
    .pipe(istanbul())
    .on('finish', function() {
      gulp.src(paths.test)
        .pipe(mocha({ reporter: 'spec' }))
        .pipe(istanbul.writeReports({
          dir: './coverage',
          reporters: [ 'lcov' ],
          reportOpts: { dir: './coverage' }
        }))
        .on('end', done);
    });
});

gulp.task('restart', ['lint']);

gulp.task('default', ['lint', 'server']);
