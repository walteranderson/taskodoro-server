var gulp        = require('gulp'),
    rimraf      = require('rimraf'),
    streamQueue = require('streamqueue'),
    bowerFiles  = require('main-bower-files');
    nodemon     = require('gulp-nodemon'),
    jshint      = require('gulp-jshint'),
    mocha       = require('gulp-mocha'),
    istanbul    = require('gulp-istanbul'),
    inject      = require('gulp-inject'),
    concat      = require('gulp-concat'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify'),
    ngAnnotate  = require('gulp-ng-annotate'),
    rename      = require('gulp-rename'),
    htmlify     = require('gulp-angular-htmlify'),
    tmplCache   = require('gulp-angular-templatecache'),
    minifyCSS   = require('gulp-minify-css');

var paths = {
  server: {
    scripts: ['server/*.js', 'server/**/*.js'],
    tests: ['server/**/*.spec.js']
  },
  client: {
    all: ['client/*.*', 'client/app/*.*', 'client/app/**/*.*'],
    scripts: ['client/app/*.js', 'client/app/**/*.js'],
    stylesheets: ['client/app/style/main.scss'],
    templates: ['client/app/**/*.html', '!client/app/index.html'],
    index: ['./client/index.html'],
    temp: ['./client/.tmp/*.*'],
    dist: ['./public/*.*']
  },
  dest: {
    dev: './client/.tmp',
    dist: './public'
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

/* Config Functions
 * ========================================
 * Agnostic helper functions
 * ========================================
 */

/*
 * Filter bower_components by file extension
 */
function filteredBower(ext) {
  var condition;

  if (ext == 'font') {
    condition = function(file) {
      return file.indexOf('ionicons/fonts');
    };
  } else {
    condition = function(file) {
      var extension = file.split('/').pop().split('.').pop();
      return extension == ext;
    };
  }

  return gulp.src(bowerFiles({ filter: condition }));
}

/*
 * Clean dev and dist directories
 */
gulp.task('clean:dist', function(cb){
  rimraf('./public', cb);
});

gulp.task('clean:dev', function(cb){
  rimraf('./client/.tmp', cb);
});

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

gulp.task('lint:client', function() {
  return gulp.src(paths.client.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/* STEP 2 - Scripts
 * ========================================
 * Compile, concatenate, and minify scripts
 * (TBA - Pulls in 3rd party libraries) and
 * Converts html templates to javascript
 * ========================================
 */

function compileAppScripts() {
  return gulp.src(paths.client.scripts)
    .pipe(ngAnnotate());
}

function compileTemplates() {
  return gulp.src(paths.client.templates)
    .pipe(htmlify())
    .pipe(tmplCache({
      root: 'app/',
      standalone: false,
      module: 'taskodoro'
    }));
}

function concatenateScripts() {
  return streamQueue({ objectMode: true }, filteredBower('js'), compileAppScripts(), compileTemplates())
    .pipe(concat('app.js'));
}

// all scripts are concatenated together,
// minified, renamed, and output to the public folder
function buildScripts(dest, minify) {
  dest   = dest || paths.dest.dev;
  minify = minify || false;

  var scripts = concatenateScripts();

  if (minify) {
    scripts = scripts
      .pipe(uglify())
      .pipe(rename({ extname: '.min.js' }));
  }

  return scripts.pipe(gulp.dest(dest));
}

gulp.task('scripts:dev', function() { return buildScripts(); });
gulp.task('scripts:dist', function() { return buildScripts(paths.dest.dist, true); });



/* STEP 3 - Stylesheets
 * ========================================
 * Compile, concatenate, and (optionally)
 * minify stylesheets
 * css:dev compiles and saves to .tmp
 * css:dist will build for production
 * ========================================
 */

function compileAppStyles() {
  return gulp.src(paths.client.stylesheets)
    .pipe(sass());
}

function concatenateStyles() {
  return streamQueue({ objectMode: true }, filteredBower('css'), compileAppStyles())
    .pipe(concat('app.css'));
}

function buildStyles(dest, minify) {
  dest   = dest || paths.dest.dev;
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

gulp.task('stylesheets:dev', function() { return buildStyles(); });
gulp.task('stylesheets:dist', function() { return buildStyles(paths.dest.dist, true); });


/*
 * Compile js and css in one task
 */
gulp.task('compile:dev', ['scripts:dev', 'stylesheets:dev']);
gulp.task('compile:dist', ['scripts:dist', 'stylesheets:dist']);

/* STEP 4 - Index page
 * ========================================
 * copies client/index.html
 * injects bower components
 * injects newly created app.js and app.css
 * new file in public/index.html
 * ========================================
 */

function compileIndex(files, dest) {
  files = files || paths.client.temp;
  dest  = dest || './client';

  var opts = {
    addRootSlash: false,
    ignorePath: ['client', 'public']
  };

  return gulp.src(paths.client.index)
    .pipe(inject(gulp.src(files, { read: false }), opts))
    .pipe(gulp.dest(dest));
}

gulp.task('index:dev', ['compile:dev'], function() { return compileIndex(); });
gulp.task('index:dist', ['compile:dist'], function() { return compileIndex(paths.client.dist, paths.dest.dist); });


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

// watch the client and restart for changes
gulp.task('watch:client', function() {
  gulp.watch(paths.client.all, ['client:restart']);
});

// Restart Tasks
gulp.task('server:restart', ['lint:server']);
gulp.task('client:restart', ['lint:client', 'scripts:dev', 'stylesheets:dev', 'index:dev']);


/* STEP 6 - Build
 * ========================================
 * Build steps for development and production
 * ========================================
 */

gulp.task('heroku:production', ['lint:server', 'lint:client', 'compile:dist', 'index:dist']);
gulp.task('default', ['clean:dev', 'lint:server', 'lint:client', 'compile:dev', 'index:dev', 'server', 'watch:client']);
