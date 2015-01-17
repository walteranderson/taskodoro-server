var gulp        = require('gulp'),
    nodemon     = require('gulp-nodemon'),
    jshint      = require('gulp-jshint'),
    mocha       = require('gulp-mocha'),
    istanbul    = require('gulp-istanbul');

var paths = {
  server: {
    scripts: ['server/*.js', 'server/**/*.js'],
    tests: ['server/**/*.spec.js']
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
gulp.task('coverage', function() {
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
        .once('end', function() { process.exit(); });
    });
});

gulp.task('test', ['lint:server', 'test:server']);


/* STEP 1 - Linting
 * ========================================
 * Linting for javascript errors
 * client js and server js
 * ========================================
 */

gulp.task('lint:server', function() {
  return gulp.src(paths.server.scripts)
    .pipe(jshint({ node: true }))
    .pipe(jshint.reporter('jshint-stylish'));
});


/* STEP 5 - Server & Watch
 * ========================================
 * Start backend server
 * Watch everything and reload on change
 * ========================================
 */

// start and watch the server
gulp.task('server', function() {
  nodemon({
    script: 'server/app.js',
    env: { NODE_ENV: 'development' }
  }).on('change', ['server:restart']);
});

// Restart Tasks
gulp.task('server:restart', ['lint:server']);


/* STEP 6 - Build
 * ========================================
 * Build steps for development and production
 * ========================================
 */

gulp.task('default', ['lint:server', 'server']);
