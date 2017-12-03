const gulp = require('gulp')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const webserver = require('gulp-webserver')
const minifycss = require('gulp-minify-css')
const browserify = require('gulp-browserify')
const sourcemaps = require('gulp-sourcemaps')
const templateCache = require('gulp-angular-templatecache')

gulp.task('fonts', gulp.parallel(() => {
    return gulp.src([
        './node_modules/bootstrap/dist/fonts/**/*',
        'src/fonts/**/*'
    ])
        .pipe(gulp.dest('docs/fonts'))
}))

gulp.task('scss', gulp.parallel(() => {
    return gulp.src([
        './node_modules/bootstrap/dist/css/bootstrap.min.css',
        'src/scss/main.scss'
    ])
        .pipe(sass())
        .pipe(minifycss())
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest('docs/css'))
}))


gulp.task('templates', gulp.series(() => {
    return gulp.src('src/templates/**/*.html')
        .pipe(templateCache('templates.js', {
            module: 'app',
            moduleSystem: 'Browserify'
        }))
        .pipe(gulp.dest('src/tmp'))
}))

gulp.task('js', gulp.series('templates', gulp.parallel(() => {
    return gulp.src([
        'src/js/index.js',
        'src/tmp/templates.js'
    ])
        .pipe(babel({
            presets: ['es2015'],
            compact: false
        }))
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify({
            mangle: false
        }))
        .pipe(concat('scripts.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('docs/js'))
})))

gulp.task('watch', gulp.parallel('fonts', 'scss', 'js', () => {
    gulp.watch('src/scss/**/*', gulp.parallel('scss'))
    gulp.watch('src/scss/**/*', gulp.parallel('scss'))
    gulp.watch('src/js/**/*', gulp.parallel('js'))
    gulp.watch('src/templates/**/*', gulp.parallel('js'))
}))

gulp.task('server', function () {
    gulp.src('docs')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            port: 8090
        }));
})

gulp.task('default', gulp.parallel('watch'))