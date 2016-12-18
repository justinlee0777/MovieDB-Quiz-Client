var gulp = require('gulp'),
	pump = require('pump'),
	plugins = require('gulp-load-plugins')();

var build = require('./gulp/build')(gulp, plugins);
var dev = require('./gulp/dev')(gulp, plugins);

gulp.task('default', ['build', 'dev']);

var buildtasks = createtarget(build);

gulp.task('build', buildtasks);

var devtasks = createtarget(dev);

gulp.task('dev', devtasks);

gulp.task('serve', devtasks, createserver('dev'));

gulp.task('launch', buildtasks, createserver('build'));

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