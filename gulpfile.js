var gulp = require('gulp'),
	pump = require('pump'),
	plugins = require('gulp-load-plugins')();

var build = require('./gulp/build')(gulp, plugins);
var serve = require('./gulp/serve')(gulp, plugins);

gulp.task('default', function def() {
});

gulp.task('build', createtarget(build), createserver('build'));

gulp.task('serve', createtarget(serve), createserver('dev'));

function createtarget(target) {
	var tasks = [];
	for( var task in target) {
		if( typeof( target[task]) !== 'function') continue;
		var taskname = target.name + '.' + task;
		gulp.task( taskname, target[task]);
		tasks = tasks.concat(taskname);
	}
	return tasks;
}

function createserver(dirname) {
	return function(cb) {
		pump([
			gulp.src( dirname ),
			plugins.webserver({
				port: 3000,
				root: [ dirname ],
				open: true
			})
		]);
	}
}