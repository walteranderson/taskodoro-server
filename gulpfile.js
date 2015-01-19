var gulp        = require('gulp'),
    nodemon     = require('gulp-nodemon'),
    jshint      = require('gulp-jshint'),
    mocha       = require('gulp-mocha'),
    istanbul    = require('gulp-istanbul'),
    open        = require('gulp-open');

var paths = {
  server: {
    start: 'app/app.js',
    scripts: ['app/*.js', 'app/**/*.js'],
    tests: ['app/**/*.spec.js']
  }
};

/* Testing
 * ========================================
 * Testing tasks
 * ========================================
 */

// Backend Testing
gulp.task('test:server', function() {
  process.env.NODE_ENV = 'test';

  return gulp.src(paths.server.tests)
    .pipe(mocha({ reporter: 'nyan' }))
    .once('end', function() { process.exit(); });
});

// Test Coverage
gulp.task('test:coverage', function() {
  process.env.NODE_ENV = 'test';

  gulp.src(paths.server.scripts)
    .pipe(istanbul())
    .on('finish', function() {
      gulp.src(paths.server.tests)
        .pipe(mocha({ reporter: 'spec' }))
        .pipe(istanbul.writeReports({
          dir: './coverage',
          reporters: [ 'lcov', 'text', 'text-summary' ],
          reportOpts: { dir: './coverage' }
        }))
        .once('end', function() {
          gulp.src('./coverage/lcov-report/index.html')
            .pipe(open());
        });
    });
});

// lint the server
gulp.task('lint:server', function() {
  return gulp.src(paths.server.scripts)
    .pipe(jshint({ node: true }))
    .pipe(jshint.reporter('jshint-stylish'));
});

// start and watch the server
gulp.task('server:run', function() {
  nodemon({
    script: paths.server.start,
    env: { NODE_ENV: 'development' }
  }).on('change', ['server:restart']);
});
gulp.task('server:restart', ['lint:server']);

// Gulp Actions
gulp.task('test', ['lint:server', 'test:server']);
gulp.task('coverage', ['lint:server', 'test:coverage']);
gulp.task('default', ['lint:server', 'server:run']);
