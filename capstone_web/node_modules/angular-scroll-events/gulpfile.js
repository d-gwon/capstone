var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('build', function () {
  gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(concat('scroll-events.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.+(js|html|css)', ['build']);
});
