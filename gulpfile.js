var gulp       = require('gulp'),
    nodemon    = require('gulp-nodemon'),
    jshint     = require('gulp-jshint'),
    mocha      = require('gulp-mocha'),
    istanbul   = require('gulp-istanbul'),
    inject     = require('gulp-inject'),
    concat     = require('gulp-concat'),
    sass       = require('gulp-sass'),
    bowerFiles = require('main-bower-files'),
    paths = {
      js: {
        server: ['server/*.js', 'server/**/*.js'],
        client: ['client/app/*.js', 'client/app/**/*.js'],
        test: ['server/**/*.spec.js']
      },
      sass: ['client/app/*.scss', 'client/app/**/*.scss'],
      templates: ['!client/app/index.html', 'client/app/**/*.html'],
      client: ['client/*.*', 'client/app/*.*', 'client/app/**/*.*']
    },
    destinations = {
      templates: './public/templates',
      js: './public/js',
      css: './public/css'
    };

gulp.task('test', function() {
  process.env.NODE_ENV = 'test';

  return gulp.src(paths.js.test)
    .pipe(mocha({ reporter: 'nyan' }))
    .once('end', function() { process.exit(); });
});

gulp.task('coverage', function() {
  process.env.NODE_ENV = 'test';

  gulp.src(paths.js.server)
    .pipe(istanbul())
    .on('finish', function() {
      gulp.src(paths.js.test)
        .pipe(mocha({ reporter: 'spec' }))
        .pipe(istanbul.writeReports({
          dir: './coverage',
          reporters: [ 'lcov', 'text', 'text-summary' ],
          reportOpts: { dir: './coverage' }
        }))
        .once('end', function() { process.exit(); });
    });
});

// ----- build stuff ----- //

gulp.task('server', function() {
  nodemon({
    script: 'server/app.js',
    env: { NODE_ENV: 'development' }
  }).on('change', ['server:restart']);
});

gulp.task('lint:server', function() {
  return gulp.src(paths.js.server)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint:client', function() {
  return gulp.src(paths.js.client)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('compile:css', function() {
  return gulp.src(paths.sass)
    .pipe(concat('app.css'))
    .pipe(sass())
    .pipe(gulp.dest('./client/.tmp'));
});

gulp.task('watch', function() {
  gulp.watch(paths.client, ['client:restart']);
});

gulp.task('inject:index', function() {
  var defaultOptions = {
    addRootSlash: false,
    relative: true
  };

  return gulp.src('./client/index.html')
    // inject bower files
    .pipe(inject(gulp.src(bowerFiles(), { read: false }), {
      name: 'bower',
      addRootSlash: false,
      relative: true
    }))
    .pipe(inject(gulp.src(paths.js.client, { read: false }), defaultOptions)) // inject app/*.js
    .pipe(inject(gulp.src('./client/.tmp/app.css', { read: false }), defaultOptions)) // inject .tmp/app.css
    .pipe(gulp.dest('./client'));
});

// restart tasks called from watch functions
gulp.task('server:restart', ['lint:server']);
gulp.task('client:restart', ['lint:client', 'compile:css', 'inject:index']);

// boot up application
gulp.task('default', ['lint:server', 'lint:client', 'compile:css', 'inject:index', 'server', 'watch']);
