// git 命令

// 载入外挂
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    rjs = require('requirejs');

gulp.task('styles', function() {
    var arr = ['public/sass/tab.scss', 'public/sass/tab2.scss'],
        i = 0, arrSingle;
    for(;arrSingle = arr[i++];){
        sass(arrSingle, {
                style: 'expanded'
            })
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(gulp.dest('public_dist/css'))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(minifycss())
            .pipe(cssnano())
            .pipe(gulp.dest('public_dist/css'))
            .pipe(notify({
                message: 'Styles task complete'
            }));
    }
    return false;
});
// 脚本
gulp.task('scripts', function(cb) {
    rjs.optimize({
        baseUrl: 'public',
        dir: 'public_dist',
        modules: [{
            name: 'scripts/views/enterjs/main'
        }, {
            name: 'scripts/views/enterjs/main2'
        }],
        fileExclusionRegExp: /^(r|build)\.js$/,
        optimizeCss: 'standard',
        removeCombined: true,
        paths: {
            jquery: "scripts/libs/jquery",
            utils: "scripts/views/common/utils",
            tabs: "scripts/views/common/tabs"
        }
    }, function(buildResponse) {
        // console.log('build response', buildResponse);
        cb();
    }, cb);
});

// 图片
gulp.task('images', function() {
    return gulp.src('public/images/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('public_dist/images'))
        .pipe(notify({
            message: 'Images task complete'
        }));
});
// 清理
gulp.task('clean', function() {
    return gulp.src(['public_dist/css', 'public_dist/scripts', 'public_dist/images'], {
            read: false
        })
        .pipe(clean());
});
// 预设任务
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'watch');
});
// 看手
gulp.task('watch', function() {
    // 看守所有.scss档
    gulp.watch('public/sass/**/*.scss', ['styles']);
    // 看守所有.js档
    gulp.watch('public/scripts/**/*.js', ['scripts']);
    // 看守所有图片档
    gulp.watch('public/images/**/*', ['images']);

    // 建立即时重整伺服器
    livereload.listen();

    // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
    gulp.watch(['public_dist/**']).on('change', livereload.changed);
});
