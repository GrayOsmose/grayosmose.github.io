'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import cssnano from 'gulp-cssnano';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';
import wrap from 'gulp-wrap';

const layoutTask = 'layoutTask',
      sassTask = 'sassTask',
      jsTask = 'jsTask',
      browserSyncTask = 'browserSyncTask',

      buildDestination = 'build',

      sassPath = 'app/scss/**/*.scss',
      jsPath = 'app/src/**/*.js',
      htmlPath = 'app/**/*.html',
      mainLayoutPath = 'app/layouts/layout.html';

gulp.task(sassTask, function() {
    return gulp.src(sassPath)
               .pipe(sass().on('error', sass.logError))               
               .pipe(concat('base.min.css'))
               .pipe(cssnano())
               .pipe(gulp.dest(buildDestination + '/css'))
               .pipe(browserSync.reload({
                    stream: true
                }))
});

gulp.task(jsTask, function() {
    return gulp.src(jsPath)
               .pipe(concat('app.build.min.js'))
               .pipe(uglify())
               .pipe(gulp.dest(buildDestination + '/src'))
               .pipe(browserSync.reload({
                    stream: true
                }))
});

gulp.task(browserSyncTask, function() {
  browserSync.init({
    server: {
      baseDir: 'build'
    },
  })
});

gulp.task(layoutTask, function () {
  return gulp.src([ htmlPath, /*except*/'!' + mainLayoutPath ])
    .pipe(wrap({ src: mainLayoutPath }))
    .pipe(gulp.dest(buildDestination))
    .pipe(browserSync.reload({
            stream: true
     }));
});

gulp.task('watch', [browserSyncTask], function (){
  gulp.watch(sassPath, [sassTask]); 
  gulp.watch(htmlPath, [layoutTask]); 
  gulp.watch(jsPath, [jsTask]); 
})

gulp.task('default', function (callback) {
  runSequence([sassTask, jsTask, layoutTask, browserSyncTask, 'watch'],
    callback
  )
});