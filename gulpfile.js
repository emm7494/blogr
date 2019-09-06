var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cache');
var exec = require('child_process').exec;
var plumbError = require('gulp-plumber');
var notify = require('gulp-notify');

/* Global Function Declarations */
function plumbError() {
	return plumber({
		errorHandler: function(err) {
			notify.onError({
				templateOptions: {
					date: new Date()
				},
				title: 'Gulp error in' + err.plugin,
				message: err.toString()
			})(err);
			this.emit('end');
		}
	});
}

/* Run Flask Server */
function runFlask(done) {
	var flaskProcess = exec('flask run');
	flaskProcess.stdout.on('data', function(data) {
		console.log(data);
	});
	flaskProcess.stderr.on('data', function(data) {
		console.log(data);
	});
	done();
}

function runBSync(done) {
	browserSync.init({
		//notify: true,
		online: false,
		//		ws: true,
		//		injectChanges: true,
		//reloadOnRestart: false,
		//watch: true,
		//	files: [ 'static/**/*.css', 'static/**/*.js' ],
		proxy: 'http://127.0.0.1:5000'
	});
	done();
}

function watchFiles(params) {
	gulp.watch('static/**/*.js').on('change', scripts);
	gulp.watch('static/**/*.css').on('change', styles);
	gulp.watch('templates/**/*.html').on('change', templates);
}

/* function templates(e) {
	console.log(`${e}` + 'styles here...');
	return gulp.src(`${e}`).pipe(browserSync.reload({ stream: true }));
} */

function templates(e) {
	console.log(e + ' templates here... ' + e);
	return gulp.src(e).pipe(plumbError()).pipe(browserSync.stream()); //.pipe(browserSync.reload({ stream: true }));
}

function styles(e) {
	console.log(e + '  styles here...');
	return gulp.src(e).pipe(plumbError()).pipe(browserSync.stream());
}

function scripts(e) {
	console.log(e + '  scripts here...');
	return gulp.src(e).pipe(plumbError()).pipe(browserSync.stream());
}

function clearCache() {
	cache.clearAll();
}

function defaultTask(done) {
	//gulp.series(runFlask, watch);
	//runFlask();
	//watch();
	runFlask();
	runBSync();
	watchFiles();
	done();
}

exports.default = gulp.series(runFlask, runBSync, watchFiles);
