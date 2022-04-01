const {src, dest, watch, parallel, series} = require('gulp');
const scss                         = require('gulp-sass')(require('sass'));
const concat                       = require('gulp-concat');
const browsersync                  = require('browser-sync').create();
const uglify                       = require('gulp-uglify-es').default;
const autoprefixer                 = require('gulp-autoprefixer');
const imagemin                     = require('gulp-imagemin');
const del                          = require('del');


function cleandist(){
    return del('dist')
}

function images(){
    return src ('app/images/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/images'))
}

function scrips(){
    return src([
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browsersync.stream())
}

function browserSync(){
    browsersync.init({
        server: {
            baseDir: "app/"
        }
    }); 
}

function styles(){
    return src('app/scss/style.scss')
    .pipe(scss({outputStyle:'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 version'],
        grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browsersync.stream())
}

function build(){
    return src([
        'app/css/*.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html'
    ], {base: 'app'} )
    .pipe(dest('dist'))
}

function watching(){
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js','!app/js/main.min.js'], scrips);
    watch(['app/*.html']).on('change', browsersync.reload)
}


exports.styles      = styles;
exports.watching    = watching;
exports.browserSync = browsersync;
exports.scrips      = scrips;
exports.images      = images;
exports.cleandist   = cleandist;

exports.build       = series(cleandist, images, build);
exports.default     = parallel(styles,browserSync,watching,scrips);