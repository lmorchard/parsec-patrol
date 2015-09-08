var _ = require('lodash');
var fs = require('fs');
var browserify = require('browserify');
var connect = require('gulp-connect');
var gulp = require('gulp');
var path = require('path');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var deploy = require('gulp-gh-pages');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify')
var rename = require('gulp-rename');
var babelify = require("babelify");
var karma = require('karma');
var transform = require('vinyl-transform');
var tap = require('gulp-tap');
var parallelize = require("concurrent-transform");

var DEBUG = true;

var buildTasks = [
  'markup',
  'stylus',
  'build-app',
  'build-tests'
];

var toWatch = [];

var moduleBundles = {
  'vendor': {
    'lodash.defaults': 'lodash.defaults',
    'lodash.assign': 'lodash.assign',
    'Vector2D': './src/lib/Vector2D',
    'QuadTree': './src/lib/QuadTree'
  },
  'debug': {
    'dat-gui': 'dat-gui',
    'stats-js': 'stats-js',
    'memory-stats': 'memory-stats',
    'plugins/datGui': './src/plugins/datGui',
    'plugins/drawStats': './src/plugins/drawStats',
    'plugins/memoryStats': './src/plugins/memoryStats',
  },
  'core': {
    'core': './src/core'
  },
};

// Dynamically add plugins/*.js to core.js bundle
fs.readdirSync('./src/plugins').filter(function (path) {
  return /\.js$/.test(path);
}).forEach(function (path) {
  var name = path.split('.').shift();
  var requireName = 'plugins/' + name;
  // Skip any plugins already added to debug.js
  if (requireName in moduleBundles.debug) { return; }
  moduleBundles.core[requireName] = './src/plugins/' + name;
});

// Create the build tasks for each of the module bundles
Object.keys(moduleBundles).forEach(function (bundleName) {
  var taskName = 'build-' + bundleName + '-bundle';
  buildTasks.push(taskName);
  gulp.task(taskName, function () {
    return browserifyModuleBundle(bundleName);
  });
});

// Dynamically build a list of all sketches
var sketchesPath = './src/sketches/';
var sketches = fs.readdirSync(sketchesPath).filter(function (path) {
  return fs.statSync(sketchesPath + path).isDirectory();
});

// Register build and watcher tasks for each sketch
sketches.forEach(function (sketchName) {
  var taskName = 'build-sketch-' + sketchName
  var srcPattern = './src/sketches/' + sketchName + '/*.js';

  gulp.task(taskName, function () {
    return gulp.src(srcPattern)
      .pipe(browserified())
      .pipe(gulp.dest('./dist/sketches/' + sketchName))
      .pipe(connect.reload());
  });

  buildTasks.push(taskName);
  toWatch.push([srcPattern, [taskName]]);
});

gulp.task('build-app', function () {
  return gulp.src('./src/app.js')
    .pipe(browserified())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-tests', function () {
  return gulp.src(['./test/index.js', './test/**/test-*.js'])
    .pipe(browserified())
    .pipe(gulp.dest('./dist-test'));
});

gulp.task('stylus', function () {
  return gulp.src('./src/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./dist'));
});

gulp.task('markup', function () {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true,
    port: 3001
  });
});

gulp.task('build', buildTasks);

gulp.task('watch', function () {

  toWatch.forEach(function (pair) {
    gulp.watch(pair[0], pair[1]);
  });

  gulp.watch('./src/**/*.styl', ['stylus']);
  gulp.watch('./src/**/*.html', ['markup']);
  gulp.watch('./src/app.js', ['build-app']);
});

gulp.task('deploy', function () {
  gulp.src('./dist/**/*')
    .pipe(deploy({}));
});

gulp.task('test', ['build'], function (done) {
  karma.server.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('server', ['build', 'connect', 'watch']);

gulp.task('default', ['server']);

function browserifyModuleBundle(bundleName) {

  var opts = {};
  if (DEBUG && bundleName == 'core') {
    opts = { debug: true };
  }

  var b = browserify();

  // Add all the modules for this bundle.
  var modules = moduleBundles[bundleName];
  for (var moduleName in moduleBundles[bundleName]) {
    b.require(modules[moduleName], {expose: moduleName});
  }

  // Skip any modules already present in other bundles.
  for (var otherBundleName in moduleBundles) {
    if (otherBundleName == bundleName) { continue; }
    for (var moduleName in moduleBundles[otherBundleName]) {
      b.external(moduleName);
    }
  }

  return b.transform(babelify)
    .bundle()
    .pipe(source(bundleName + '.js'))
    .pipe(gulpif(!opts.debug, streamify(uglify())))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
}

function browserified () {
  return transform(function(filename) {

    var b = browserify({
      entries: [filename],
      debug: true,
      fullPaths: true
    });

    // Skip any modules already present in other bundles.
    for (var bundleName in moduleBundles) {
      for (var moduleName in moduleBundles[bundleName]) {
        b.external(moduleName);
      }
    }

    return b.transform(babelify).bundle();

  });
};
