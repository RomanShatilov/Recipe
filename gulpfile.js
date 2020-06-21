const gulp 						= require('gulp'),
			exec 						= require('child_process').exec,
			sass 						= require('gulp-sass'),
			autoprefix 			= require('gulp-autoprefixer'),
			plumber	 				= require('gulp-plumber'),
			jade	 					= require('gulp-jade'),
			cssnano 				= require('gulp-cssnano'),
			ccsMinName 			= require('gulp-minify-cssnames'),
			browserSync 		= require('browser-sync'),
			cache 					= require('gulp-cache'),
			concat 					= require('gulp-concat'),
			imageMin 				= require('gulp-imagemin'),
			notify 					= require('gulp-notify'),
			clean 					= require('gulp-clean'),
			unglify 				= require('gulp-uglify');
      babel 					= require('gulp-babel');


const path = {
	app: 'app',
	style: {
		css: 	'app/css',
		scss: 'app/scss/**/*.scss',
		libs: 'app/libs/**/*.css'
	},
	jade: 'app/jade/*.jade',
	script: {
		js:  'app/js',
	}
};

// Call compilation of sass to css
gulp.task('sass', async function(){
	return gulp.src(path.style.scss)
			.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
			.pipe(sass())
			.pipe(cssnano())
			// .pipe(autoprefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
			.pipe(gulp.dest(path.style.css))
			.pipe(browserSync.reload({stream: true}))
});

// Compilation jade to html
gulp.task('jade', async function(){
	return gulp.src(path.jade)
			.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
			.pipe(jade())
			.pipe(gulp.dest(path.app))
			.pipe(browserSync.reload({stream: true}));
});


// Css libs compilation to libs.min.css in app/css
gulp.task('css-libs', async function () {
	// return gulp.src([
	// 	'app/libs/reset.css',
	// 	path.style.libs
	// ])
	// 		.pipe(cssnano())
	// 		.pipe(concat('libs.min.css'))
	// 		.pipe(gulp.dest(path.style.css))
	// 		.pipe(browserSync.reload({stream: true}));
});

// Css libs compilation to libs.min.js in app/js
gulp.task('js-libs', async function () {
	// return gulp.src([
	// 	'app/libs/jquery/jquery.js',
	// 	'app/libs/slick/js/slick.js',
	// 	'app/libs/owl-carousel/js/owl.carousel.min.js',
	// 	'app/libs/magnific-popup/js/jquery.magnific-popup.min.js',
	// ])
	// 		.pipe(concat('libs.min.js'))
	// 		.pipe(unglify())
	// 		.pipe(gulp.dest(path.script.js))
	// 		.pipe(browserSync.reload({stream: true}));
});


// Css libs compilation to libs.min.js in app/js
gulp.task('js', async function () {
	return gulp.src([
		'app/js/*.js',
	])
			.pipe(browserSync.reload({stream: true}));
});


//Call web-server localhost for browsing your website
gulp.task('browser-sync', async function(){
	browserSync({
		files: ('app/*.html'),
		server: {
			baseDir: path.app
		},
		notify: false
	});
});

// Call task for watching all the files in your project
gulp.task('watch', async function(){
	gulp.watch(path.style.scss, gulp.series('sass'));
	gulp.watch('app/jade/**/*.jade', gulp.series('jade'));
	gulp.watch('app/libs/**/*.css', gulp.series('css-libs'));
	gulp.watch('app/libs/**/*.js', gulp.series('js-libs'));
	gulp.watch('app/js/*.js', gulp.series('js'));
	gulp.watch('app/*.html');
});

gulp.task('clean', async function() {
	return gulp.src('dist', {read: true})
			.pipe(clean())
});

// Sending all images to folder dist/img when task build is running
gulp.task('img', async function() {
	return gulp.src('app/img/**/*')
			.pipe(cache(imageMin({ // With cashing
				// .pipe(imageMin({ // Compress without cashing
				interlaced: true,
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				// use: [pngquant()]
			})))
			.pipe(gulp.dest('dist/img'));
});


gulp.task('build', gulp.series('sass', 'jade', 'css-libs', 'js-libs'), async function() {
  return (
    gulp.src('app/css/**/*.css')
      .pipe(gulp.dest('dist/css')),

      gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts')),

      gulp.src('app/js/index.js')
        .pipe(babel({
          presets: ['@babel/env']
        }))
        .pipe(gulp.dest('dist')),

      gulp.src('app/json/*.json')
        .pipe(gulp.dest('dist')),

      gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist/img')),

      gulp.src('app/*.html')
        .pipe(gulp.dest('dist'))
  );

});

gulp.task('clear', function(callback) {
	return cache.clearAll();
});

gulp.task('server', function (cb) {
	exec('node server/app.js', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
})

gulp.task('default', gulp.series('browser-sync', 'sass', 'jade', 'css-libs', 'js-libs', 'watch'));