'use strict';
const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    bump = require('gulp-bump');

gulp.task('bump', function () {
    gulp
        .src('./package.json')
        .pipe(bump({type: 'minor'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-major', function () {
    gulp
        .src('./package.json')
        .pipe(bump({type: 'major'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-patch', function () {
    gulp
        .src('./package.json')
        .pipe(bump({type: 'patch'}))
        .pipe(gulp.dest('./'));
});

gulp.task('minify-and-concat-css', function () {
    return gulp
        .src('src/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('dist/css/'))
});

gulp.task('pre-build', function () {
    return gutil.log('Gulp is building!');
});

gulp.task('build', [
    'pre-build', 'clean-js', 'minify-and-concat-css', 'bump-patch'
], function () {
    gulp
        .src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.', {sourceRoot: '.'}))
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('clean-js', function () {
    gutil.log('Started Cleaning old build');
    return gulp
        .src('dist/js/main.min.js', {read: false})
        .pipe(clean());
});