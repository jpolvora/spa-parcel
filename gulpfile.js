/* eslint-disable no-undef */
const gulp = require('gulp')
const git = require('gulp-git')
const bump = require('gulp-bump')
const filter = require('gulp-filter')
const tagVersion = require('gulp-tag-version')

function inc(importance) {
  return gulp.src(['./package.json'])
    .pipe(bump({ type: importance }))
    .pipe(gulp.dest('./'))
    .pipe(git.commit('bumps package version'))
    .pipe(filter('package.json'))
    .pipe(tagVersion())
}

gulp.task('patch', function () { return inc('patch') })
gulp.task('feature', function () { return inc('minor') })
gulp.task('release', function () { return inc('major') })
