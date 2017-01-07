// Documentation
// https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
// https://github.com/gulpjs/gulp/blob/master/docs/API.md

'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del'); // rm -rf
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');

var paths = {
  resources: ['src/resources/**/*'],
  scss: ['src/styles/**.scss'],
  js: ['src/js/**.js'],
  gulpfile: ['gulpfile.js']
};



// Delete the dist folder
gulp.task('delete-dist', function() {
  return del(['dist']);
});

// Copy over the files in the resources folder "as they are" to the dist folder
gulp.task('copy-resources', ['delete-dist'], function() {
  return gulp.src('src/resources/**/*')
    .pipe(gulp.dest('dist/'));
});

// Compile all HTML to dist folder
gulp.task('compile-html', ['delete-dist'], function() {});




// Compile all CSS to dist folder
// Edited to always minify css
gulp.task('compile-css', ['delete-dist'], function() {
  return gulp.src('src/styles/imports.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['> 1% in AU', 'Explorer > 9', 'Firefox >= 17', 'Chrome >= 10', 'Safari >= 6', 'iOS >= 6'],
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(rename('styles.min.css')) // added .min
    .pipe(gulp.dest('dist'))
});

// Minify the CSS file
// Included above for the time being

// gulp.task('minify-css', ['compile-css'], function() {
//   return gulp.src('dist/assets/css/styles.css')
//     .pipe(cleanCSS())
//     .pipe(rename('styles.min.css'))
//     .pipe(gulp.dest('dist'));
// });




// Compile all JS to dist folder
gulp.task('minify-js', ['delete-dist'], function() {
  gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
    .pipe(plumber())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('temp/js'))
});

gulp.task('concat-js', ['delete-dist','minify-js'], function() {
  return gulp.src(['./bower_components/jquery/dist/jquery.min.js', './bower_components/velocity/velocity.min.js',
      './temp/js/**.min.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('delete-temp', ['concat-js'], function() {
  return gulp.src('./temp')
    .pipe(clean({
      force: true
    }))
});



// Watch Tasks

// gulp.task('watch', function() {
  // gulp.watch('gulpfile.js', ['default']);
  // gulp.watch('src/js/**/*.js', ['delete-dist','minify-js', 'concat-js', 'delete-temp']);
  // gulp.watch('src/styles/**/*.scss', ['delete-dist', 'copy-resources', 'compile-css',]);
  // gulp.watch('src/resources/', ['default'])
// })

// Watch all the files and run specific tasks if one changes
// gulp.task('watch', function() {
//   gulp.watch(paths.resources, ['default']);
//   gulp.watch(paths.scss, ['default']);
//   gulp.watch(paths.js, ['default']);
//   gulp.watch(paths.gulpfile, ['default']);
// });

// Define all available gulp tasks
gulp.task('default', ['delete-dist', 'copy-resources', 'compile-html', 'compile-css', 'minify-js', 'concat-js', 'delete-temp']); // minify-css removed
