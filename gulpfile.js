var browserify = require('browserify');
var connect = require('gulp-connect');
var gulp = require('gulp');
var path = require('path');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var deploy = require('gulp-gh-pages');
var to5ify = require("6to5ify");
var karma = require('karma');

gulp.task('build', ['browserify', 'browserify-tests', 'stylus', 'compress', 'markup']);

gulp.task('browserify', function () {
  browserify({debug: false})
    .add('./src/sketches/viewport/index.js')
    .transform(to5ify)
    .bundle()
    .pipe(source('sketches/viewport/index.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());

  return browserify({debug: false})
    .add('./src/app.js')
    .transform(to5ify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('browserify-tests', function () {
  return browserify({debug: false})
    .add('./test/index.js')
    .transform(to5ify)
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('./dist-test'));
});

gulp.task('stylus', function () {
  return gulp.src('./src/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('compress', function () {
  return gulp.src('./dist/app.js')
    .pipe(uglify())
    .pipe(rename(function (file) {
      file.basename += '-min';
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('markup', function () {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true,
    port: 3001
  });
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*', ['build']);
  gulp.watch('./test/**/*', ['build']);
});

gulp.task('deploy', function () {
  gulp.src('./dist/**/*')
    .pipe(deploy({}));
});

gulp.task('server', ['build', 'connect', 'watch']);

gulp.task('test', ['build'], function (done) {
  karma.server.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('default', ['server']);
