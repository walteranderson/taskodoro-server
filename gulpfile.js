var gulp       = require('gulp'),
    nodemon    = require('gulp-nodemon'),
    jshint     = require('gulp-jshint'),
    mocha      = require('gulp-mocha'),
    istanbul   = require('gulp-istanbul'),
    inject     = require('gulp-inject'),
    concat     = require('gulp-concat'),
    sass       = require('gulp-sass'),
    bowerFiles = require('main-bower-files'),
    uglify     = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    rename     = require('gulp-rename'),
    htmlify    = require('gulp-angular-htmlify'),
    templateCache = require('gulp-angular-templatecache'),
    streamqueue = require('streamqueue'),
    minifyCSS  = require('gulp-minify-css');

var paths = {
      js: {
        server: ['server/*.js', 'server/**/*.js'],
        client: ['client/app/*.js', 'client/app/**/*.js'],
        test: ['server/**/*.spec.js']
      },
      sass: ['client/app/style/main.scss'],
      templates: ['!client/app/index.html', 'client/app/**/*.html'],
      client: ['client/*.*', 'client/app/*.*', 'client/app/**/*.*']
};

var destinations = {
      public: './public',
      templates: './public/templates',
      js: './public/js',
      css: './public/css'
};

// Backend Testing
gulp.task('test', function() {
  process.env.NODE_ENV = 'test';

  return gulp.src(paths.js.test)
    .pipe(mocha({ reporter: 'nyan' }))
    .once('end', function() { process.exit(); });
});

// Test Coverage
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


/* Script-Related Tasks
 * ========================================
 * Compile, concatenate, and minify scripts
 * (TBA - Pulls in 3rd party libraries) and
 * Converts html templates to javascript
 * ========================================
 */

function compileAppScripts() {
  return gulp.src(paths.js.client)
    .pipe(ngAnnotate());
}

function compileTemplates() {
  return gulp.src(paths.templates)
    .pipe(htmlify())
    .pipe(templateCache({
      root: 'app/',
      standalone: false,
      module: 'taskodoro'
    }));
}

// all scripts are concatenated together,
// minified, renamed, and output to the public folder
function buildScripts() {
  return streamqueue({ objectMode: true }, compileAppScripts(), compileTemplates())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(destinations.public));
}

gulp.task('scripts:dist', function() { return buildScripts(); });



/* Style-Related Tasks
 * ========================================
 * Compile, concatenate, and (optionally)
 * minify stylesheets
 * css:dev compiles and saves to .tmp
 * css:dist will build for production
 * ========================================
 */

function compileAppStyles() {
  return gulp.src(paths.sass)
    .pipe(sass());
}

function concatenateStyles() {
  return streamqueue({ objectMode: true }, compileAppStyles())
    .pipe(concat('app.css'));
}

function buildStyles(dest, minify) {
  dest   = dest || './client/.tmp';
  minify = minify || false;

  var styles = concatenateStyles();

  if (minify) {
    styles = styles
      .pipe(minifyCSS())
      .pipe(rename({ extname: '.min.css' }));
  }

  return styles
    .pipe(gulp.dest(dest));
}

gulp.task('css:dev', function() { return buildStyles(); });
gulp.task('css:dist', function() { return buildStyles('./public', true); });












 // compile scss into app.css
gulp.task('compile:css', function() {
  return gulp.src(paths.sass)
    .pipe(concat('app.css'))
    .pipe(sass())
    .pipe(gulp.dest('./client/.tmp'));
});





// start and watch the server
gulp.task('server', function() {
  nodemon({
    script: 'server/app.js',
    env: { NODE_ENV: 'development' }
  }).on('change', ['server:restart']);
});

// linting
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

// watch the client and restart for changes
gulp.task('watch', function() {
  gulp.watch(paths.client, ['client:restart']);
});

// inject bowerfiles and js files into index.html
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
