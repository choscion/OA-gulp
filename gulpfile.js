const { src, dest, watch, parallel, series } = require('gulp');
const del = require("del");
const path = require("path");

const ejs = require('gulp-ejs');
const rename = require('gulp-rename');

const stylus = require('gulp-stylus');

const browserSync = require('browser-sync').create();
// const reload = browserSync.reload;

// path object
const paths = {
  src: "src/",
  dist: "dist/",
  html_pc: "src/pc/",
  html_pc_exclude: "src/pc/contents/",
  html_pc_dist: "dist/pc/",
  styl_src: "src/css",
  styl_dist: "dist/css",
  styl_exclude: "src/css/_partial/",
  styl_pc_exclude: "src/css/pc/_partial/",
  styl_app_exclude: "src/css/app/_partial/",
};

// index build
function compileIndex(cb) {
  return src(path.join(paths.src, "**/*.html"))
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(dest(paths.dist))
    .pipe(browserSync.stream());
}
// pages build
function compileContent(cb) {
  return src([
      path.join(paths.html_pc, "**/*.ejs"),
      `!${path.join(paths.html_pc_exclude, '**/*.ejs')}`
    ])
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(dest(paths.html_pc_dist))
    .pipe(browserSync.stream());
}

// stylus
async function taskStylus(cb) {
  return src([
      path.join(paths.styl_src, "**/*.styl"),
      `!${path.join(paths.styl_exclude, '**/*.styl')}`,
      `!${path.join(paths.styl_pc_exclude, '**/*.styl')}`,
      `!${path.join(paths.styl_app_exclude, '**/*.styl')}`
    ])
    .pipe(stylus({ compress: true }))
    .pipe(rename({ extname: '.css' }))
    .pipe(dest(paths.styl_dist))
}

// clean dist
async function cleanDist(cb) {
  await del(path.join(paths.dist), { force: true });
  cb();
}

function startDevServer(cb) {
  let options = {
    server: {
      baseDir: paths.dist,
      directory: true,
    },
  };

  browserSync.init(options);
  cb();
}

// watch
function watchFiles(cb) {
  watch(path.join(paths.src, "**/*.html"), compileIndex);
  watch(path.join(paths.src, "**/*.ejs"), compileContent);
  watch(path.join(paths.styl_src, '**/*.styl'), taskStylus);
  cb();
}

exports.default = series(
  parallel(compileIndex, compileContent, taskStylus),
  watchFiles,
  startDevServer
);

exports.build = series(
  cleanDist,
  parallel(compileIndex, compileContent, taskStylus)
);

exports.deploy = series(
  cleanDist,
  compileIndex,
  compileContent,
  taskStylus
);