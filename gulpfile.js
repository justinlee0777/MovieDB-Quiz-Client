var gulp = require('gulp'),
	pump = require('pump'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	inject = require('gulp-inject'),
	htmlmin = require('gulp-htmlmin'),
	connect = require('gulp-connect'),
	open = require('gulp-open');

gulp.task('default', function def() {
});

gulp.task('build', [ 'copyoverassets', 'compressjs', 'compresscss', 'compresshtml'], function createserver(cb) {
	connect.server({
		port: 3000,
		root: [ 'build' ]
	});

	open({
		uri: 'localhost:3000'
	});
});

gulp.task('copyoverassets', function copyoverassets(cb) {
	pump([
			gulp.src([ 'assets/*', 'config/*' ], { cwd: 'src', base: 'src' }),
			gulp.dest('build')
		],
		cb
	);
});

gulp.task('compressjs', function compressjs(cb) {
	pump([
			gulp.src([ 'src/*.js', 'src/js/*.js', 'src/js/*/*.js']),
			concat('index.js'),
			uglify(),
			gulp.dest('build')
		],
		cb
	);
});

gulp.task('compresscss', function compresscss(cb) {
	pump([
			gulp.src([ 'src/*.css', 'src/css/*.css']),
			concat('index.css'),
			cleanCSS({ compatibility: 'ie8' }),
			gulp.dest('build')
		],
		cb
	);
});

gulp.task('compresshtml', function compresshtml(cb) {
	pump([
			gulp.src([ '*.html', 'partials/*.html'], { cwd: 'src', base: 'src' }),
			htmlmin({ collapseWhitespace: true }),
			gulp.dest('build')
		],
		cb
	);
});