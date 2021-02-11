const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass");
const imagemin = require("gulp-imagemin");
const fileinclude = require("gulp-file-include");

// Swallow Error:
function swallowError(error) {
    console.log(error.toString());
    this.emit("end");
} 

// Compilar html:
function html() {
    return gulp.src("src/index.html")
        .pipe(fileinclude({
            prefix: "@@",
            basepath: "@root"
        }))
        // Minificar o html:
            // collapseWhitespace: retirar espaços em branco
        .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true }))
        .on("error", swallowError)
        .pipe(gulp.dest("dist/"));
}

// Compilar sass:
function sassTask() {
    return gulp.src("src/assets/sass/main.scss")
        // Converte sass para css minificado com gulp sass
        .pipe(sass({ outputStyle: "compressed"}))
        .on("error", swallowError)
        .pipe(gulp.dest("dist/css/"));
}

// Compilar imagens
function images() {
    return gulp.src("src/assets/images/*.*")
    .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
    })
]))
    .pipe(gulp.dest("dist/images/"))
}

const develop = gulp.parallel(sassTask, html, images);

module.exports = {
    default: develop
}