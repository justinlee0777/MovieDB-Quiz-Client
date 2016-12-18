var pump = require('pump');

module.exports = function target_build(gulp, plugins) {
	var options = { cwd: 'src', base: 'src' };
	return {
		name: 'build',
		copyoverassets: copyoverassets,
		compressjs: compressjs,
		compresscss: compresscss,
		compresshtml: compresshtml
	};

	function copyoverassets(cb) {
		pump([
				gulp.src(['assets/*', 'config/*' ], options),
				gulp.dest('build')
			], cb);
	}

	function compressjs(cb) {
		pump([
				gulp.src(['*.js', 'js/*.js', 'js/*/*.js'], options),
				plugins.concat('index.js'), plugins.uglify(),
				gulp.dest('build')
			], cb)
	}

	function compresscss(cb) {
		pump([
				gulp.src(['*.css', 'css/*.css'], options),
				plugins.concat('index.css'), plugins.cleanCss({ compatibility: 'ie8' }),
				gulp.dest('build')
			], cb);
	}

	function compresshtml(cb) {
		pump([
				gulp.src([ '*.html', 'partials/*.html'], options),
				plugins.htmlmin({ collapseWhitespace: true }),
				gulp.dest('build')
			], cb);
	}
};
