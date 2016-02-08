'use strict'
/**
* Gulp File
* Version 1.0
*/

/*
* Dependencies
*/
var gulp = require('gulp'),
  	concat = require('gulp-concat'),
  	uglifycss = require('gulp-uglifycss'),
  	uglify = require('gulp-uglify');

gulp.task('default', ['css']);

/*
* Configuración de la tarea 'demo'
*/
gulp.task('css', [], function () {
  	gulp.src('source/assets/css/*.css')
  	.pipe(concat('iprofesional.css'))
  	.pipe(uglifycss())
  	.pipe(gulp.dest('www/css/'))
});