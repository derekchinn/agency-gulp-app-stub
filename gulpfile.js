var gulp = require('gulp');
var rename = require('gulp-rename');
var del = require('del');

var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');

var browserSync = require('browser-sync');
var reload = browserSync.reload;


/**
 * Setup build paths
 **/
var prependBase = function (base, obj) {
    for (k in obj) {
        if (obj.hasOwnProperty(k)) {
            obj[k] = base + obj[k];
        }
    }
};

var src = (function () {
    var sources = {
        fonts: '/scss/fonts/*.otf',
        imgs: '/imgs/*.png',
        js: '/**/*.js',
        sass: '/scss/*.scss'
    };
    prependBase('./src', sources);

    return sources;  
})();

var dest = (function () {
    var destinations = {
        css: '/css',
        fonts: '/css/fonts',
        imgs: '/imgs',
        js: '/js'
    };
    prependBase('./dist', destinations);

    return destinations;
})();

/**
 * TASK DEFINITIONS
 **/

// Common tasks
gulp.task('clean', function (cb) {
    return del(dest.base + '/**', cb);
});

// Compilation task
gulp.task('sass-build', function () {
    return gulp.src(src.sass)
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dest.css));
});

gulp.task('js-build', function () {
    return rjs({
        baseUrl: '.',
        name: 'lib/almond/almond',

        // Change this out to whatever
        out: 'main.min.js',

        // Add any paths for non-package resources
        paths: {
            jquery: 'lib/jquery/dist/jquery',
            hogan: 'lib/hogan/web/builds/3.0.2/hogan-3.0.2.amd',
            hgn: 'lib/requirejs-hogan-plugin/hgn',
            text: 'lib/requirejs-hogan-plugin/text'
        },

        // Change the package name as needed and add
        // additional packages as needed
        packages: [{
            name: 'stub',
            location: 'src'
        }],
        shim: {
            jquery: {
                exports: '$'
            }
        },
        stubModules: ['text', 'hgn'],

        // Have this match the main package name
        include: ['stub'],
        namespace: 'Livefyre'
    })

    // Comment out if you don't want it minified
    .pipe(uglify())
    .pipe(gulp.dest(dest.js));
});

gulp.task('imgs-build', function () {
    return gulp.src(src.imgs)
        .pipe(gulp.dest(dest.imgs));
});

gulp.task('fonts-build', function () {
    return gulp.src(src.fonts)
        .pipe(gulp.dest(dest.fonts));
});

// Livereload server
gulp.task('browser-sync', function () {
    browserSync({
        open: false,
        server: {
            baseDir: './',
            directory: true
        }
    });
});

gulp.task('sass-livereload', function () {
    return gulp.src(src.sass)
        .pipe(sass())
        .pipe(gulp.dest(dest.css))
        .pipe(reload({stream: true}));
});

gulp.task('js-livereload', function () {
    return gulp.src(src.js)
        .pipe(reload({stream: true}));
});

/**
 * TARGET DEFINITIONS
 **/
 
// Default - livereload and continuous building
gulp.task('default', ['sass-livereload', 'browser-sync'], function () {
    gulp.watch(src.sass, ['sass-livereload']);
});

// Just build the files for deployment
gulp.task('build', ['clean', 'sass-build', 'js-build', 'imgs-build', 'fonts-build'], function () {});
