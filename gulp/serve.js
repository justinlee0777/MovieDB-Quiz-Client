var pump = require('pump');

module.exports = function target_dev(gulp, plugins) {
	var options = { cwd: 'src', base: 'src' };
	return {
		name: 'dev',
		copy: copy,
		injecthtml: injecthtml
	};

	function copy(cb) {
		pump([
				gulp.src(['**', '!index.html'], options),
				gulp.dest('dev')
			], cb);
	}

	function injecthtml(cb) {
		pump([
				gulp.src('index.html', options),
				plugins.inject( gulp.src([ 'dev/css/*.css', 'dev/js/*.js' ]), { addRootSlash: false, ignorePath: 'dev/', removeTags: true }),
				gulp.dest('dev')
			], cb);
	}
};