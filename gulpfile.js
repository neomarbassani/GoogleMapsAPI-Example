var gulp = require('gulp');
var connect = require('gulp-connect');

var app = 'app/';

gulp.task('connect', function () {
    connect.server({
        port: 8080,
        root: ['.', app],
        livereload: true
    });
});

gulp.task('default', ['connect']);
