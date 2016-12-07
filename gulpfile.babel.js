'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import cssnano from 'gulp-cssnano';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';

const buildDestination = 'build/',
      sassPath = 'app/scss/**/*.scss',
      jsPath = 'app/src/**/*.js';

gulp.task('sass', function() {
    return gulp.src(sassPath)
               .pipe(sass().on('error', sass.logError))               
               .pipe(concat('base.min.css'))
               .pipe(cssnano())
               .pipe(gulp.dest(buildDestination + '/css'))
               .pipe(browserSync.reload({
                    stream: true
                }))
});

gulp.task('js', function() {
    return gulp.src(jsPath)
               .pipe(concat('app.build.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest(buildDestination + '/src'))
               .pipe(browserSync.reload({
                    stream: true
                }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('watch', ['browserSync'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  // Other watchers
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/src/**/*.js', ['js']); 
})

gulp.task('default', function (callback) {
  runSequence(['sass', 'js', 'browserSync', 'watch'],
    callback
  )
});