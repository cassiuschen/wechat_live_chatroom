var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    //imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    coffee = require('gulp-coffee'),
    slim = require('gulp-slim'),
    del = require('del'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    NWBuilder = require('node-webkit-builder');

gulp.task('default', function() {
    gulp.run("libs");
    gulp.run("generate");
    gulp.run("watch");
});

// Basic Assets Generate Functions =========================

gulp.task('scss', function() {
  gulp.src('src/stylesheets/*.scss')
    .pipe(autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
    .pipe(sass({ precision: 30, style: 'expanded' }))
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(notify({ message: 'Stylesheets task complete!' }));
});
gulp.task('css', function() {
  gulp.src('src/stylesheets/*.css')
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(notify({ message: 'CSS Stylesheets task complete!' }));
});

gulp.task('coffee', function() {
  gulp.src('./src/javascripts/*.coffee')
    .pipe(coffee({bare: true}).on('error', console.log))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    //.pipe(concat('main.js'))
    .pipe(gulp.dest('public/javascripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/javascripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('js', function() {
  gulp.src('./src/javascripts/*.js')
    .pipe(gulp.dest('public/javascripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/javascripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('slim', function () {
  gulp.src('./src/views/*.slim')
    .pipe(slim({pretty: true, options: "encoding='utf-8'"}))
    .pipe(gulp.dest('public/'))
    .pipe(notify({ message: 'Slim task complete' }));
})

gulp.task('image', function() {
  gulp.src('./src/images/**')
    .pipe(gulp.dest('public/images'))
    .pipe(notify({ message: 'Images task complete' }));
})
// Basic Functions Done ==================================

// Libs Copy ========================================
var libs = {
    js: [
        "vendor/assets/jquery/dist/jquery.js",
        "vendor/assets/angular/angular.js",
        "vendor/assets/angular-route/angular-route.js",
        "vendor/assets/angular-sanitize/angular-sanitize.js"
    ],
    css: [
    ],
    font: [
        "vendor/fonts/**"
    ]
};

gulp.task("libs", function() {
  gulp.src(libs.js)
    .pipe(gulp.dest('public/javascripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/javascripts'))
    .pipe(notify({ message: 'Libs-Scripts task complete' }));

  gulp.src(libs.css)
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(notify({ message: 'Libs-Stylesheets task complete!' }));

  gulp.src(libs.font)
    .pipe(gulp.dest('public/fonts'))
    .pipe(notify({ message: 'Libs-Fonts task complete!' }));
});

gulp.task("data", function() {
  gulp.src('src/data/*.*')
    .pipe(gulp.dest('public/data'))
    .pipe(notify({ message: 'JSON Data Updated!' }));
});

// Libs Done ============================================

// Server Doen ======================================

gulp.task('generate', ['image', 'scss', 'css', 'coffee', 'js', 'slim', 'data'])
gulp.task('clean', function(cb) {
    del(['public/stylesheets/*.css', 'public/stylesheets/*.map', 'public/javascripts'], cb)
});
gulp.task('reload', ['clean', 'default'])

gulp.task('watch', function() {

    livereload.listen();
    gulp.watch(['src/**']).on('change', livereload.changed);

    gulp.watch('src/images/*.*', ['image']);
    gulp.watch('src/data/*.*', ['data']);

    // Watch .scss files/
    gulp.watch('src/stylesheets/*.scss', ['scss']);
    gulp.watch('src/stylesheets/*.css', ['css']);

    // Watch .coffee files
    gulp.watch('src/javascripts/*.coffee', ['coffee']);

    // Watch .js files
    gulp.watch('src/javascripts/*.js', ['js']);

    // Watch .slim files
    gulp.watch('src/views/*.slim', ['slim']);

});