var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var jade = require('gulp-jade');
var data = require('./src/data');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var imgMin = require('gulp-imagemin');
var rename = require('gulp-rename');
var path = require('path');
var bootstrap = path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets');

var paths = {
  sass: './src/styles/**/*.scss',
  jade: ['./src/jade/**/*.jade', '!./src/jade/**/_*.jade'],
  js: './src/scripts/index.js' ,
  img: './src/images/**/*'
};

paths.output = {
  css: './build/css',
  js: './build/js',
  img: './build/images'
};


gulp.task('clean', function() {
  del(['./build']);
});


gulp.task('sass', function() {
  return gulp.src(paths.sass)
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: [bootstrap]
    }))
    .pipe(gulp.dest(paths.output.css));
});


gulp.task('jade', function() {
  return gulp.src(paths.jade)
    .pipe(jade({
      pretty: true,
      locals: data
    }))
    .pipe(gulp.dest('./build'));
});


gulp.task('scripts', function() {
  return browserify({
      entries: paths.js
    })
    .bundle()
    .pipe(source('index.bundle.js'))
    .pipe(gulp.dest(paths.output.js));
});


gulp.task('images', function() {
  return gulp.src(paths.img)
    .pipe(rename({
      basename: 'test',
      suffix: '-1'
    }))
    .pipe(imgMin({
      optimizationLevel: 3,
      progressive: true
    }))
    .pipe(gulp.dest(paths.output.img));
});


gulp.task('watch', ['default'], function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.jade[0], ['jade']);
  gulp.watch(paths.img, ['images']);
});


gulp.task('default', ['clean', 'sass', 'jade', 'images', 'scripts']);
