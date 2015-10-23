var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var reload = browserSync.reload;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var image = require('gulp-image');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');



//********************************
// Development
//********************************

gulp.task('browser-sync-dev', ['images', 'html-dev', 'css-dev', 'scripts-dev'], function(){
	browserSync({
		server:{
			baseDir:"./build"
		}
	});
	gulp.watch('css/*.less', ['css-dev']);
	gulp.watch('js/*.js', ['scripts-dev']);
	gulp.watch("./*.html", ['html-dev']);
	
});

gulp.task('css-dev', function() {
    return gulp.src('css/main.less')
    	.pipe(plumber())
        .pipe(less())
		.pipe(autoprefixer({
			cascade: true
		}))
        .pipe(gulp.dest('build/css'))
        .pipe(reload({stream: true}));
});

gulp.task('scripts-dev', function() {
	return gulp.src(['js/libs/*.js','js/*.js'])
	.pipe(plumber())
	.pipe(concat('main.js'))
	.pipe(gulp.dest('build/js/'))
	.pipe(reload({stream: true}));
});

gulp.task('html-dev', function(){
	return gulp.src(['./*html'])
	.pipe(gulp.dest('build'))
	.pipe(reload({stream: true}));
});

//********************************
// Production
//********************************

gulp.task('clean-build', function(){
	return del([
		"build/**/*",		
	]);
});

gulp.task('css-prod', ['clean-build'], function() {
    return gulp.src('css/main.less')
    	.pipe(plumber())
        .pipe(less())
		.pipe(autoprefixer({
			cascade: true
		}))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css'));
});

gulp.task('scripts-prod', ['clean-build'], function() {
	return gulp.src(['js/libs/*.js','js/*.js'])
	.pipe(plumber())
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	// .pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('build/js/'));
});

gulp.task('html-prod', ['clean-build'], function(){
	return gulp.src(['./*html'])
	.pipe(htmlmin({collapseWhitespace: true, minifyCSS: true}))
	.pipe(gulp.dest('build'))
});


//********************************
// Misc
//********************************
gulp.task('images', ['clean-build'], function(){
	return gulp.src(['images/**/*.jpg', 'images/**/*.jpeg', 'images/**/*.png'])
	.pipe(image())
	.pipe(gulp.dest('build/images'))
})




//********************************
// CLI Setup
//********************************
gulp.task('default', ['clean-build', 'browser-sync-dev']);
gulp.task('production', ['clean-build', 'images', 'css-prod', 'scripts-prod', 'html-prod']);