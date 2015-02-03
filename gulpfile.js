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

var PATH = {
  src: './src',
  main: 'app.js',
  stylus: 'app.styl',
  srcFiles: './src/**/*',
  dist: './dist',
  distFileJS: 'app.js',
  distFileCSS: 'app.css'
};

gulp.task('build', ['browserify', 'stylus', 'compress', 'markup']);

gulp.task('browserify', function () {
  browserify({debug: false})
    .add(PATH.src + '/' + PATH.main)
    .bundle()
    .pipe(source(PATH.distFileJS))
    .pipe(gulp.dest(PATH.dist))
    .pipe(connect.reload());
});

gulp.task('stylus', function () {
  gulp.src(path.join(PATH.src, PATH.stylus))
    .pipe(stylus())
    .pipe(concat(PATH.distFileCSS))
    .pipe(gulp.dest(PATH.dist))
    .pipe(connect.reload());
});

gulp.task('compress', function () {
  gulp.src(path.join(PATH.dist, PATH.distFileJS))
    .pipe(uglify())
    .pipe(rename(function (file) {
      file.basename += '-min';
    }))
    .pipe(gulp.dest(PATH.dist))
    .pipe(connect.reload());
});

gulp.task('markup', function () {
  gulp.src(path.join(PATH.src, '/**/*.html'))
    .pipe(gulp.dest(PATH.dist))
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
  gulp.watch(PATH.srcFiles, ['build']);
});

gulp.task('deploy', function () {
  gulp.src(PATH.dist + '/**/*')
    .pipe(deploy({}));
});

gulp.task('server', ['build','connect','watch']);
