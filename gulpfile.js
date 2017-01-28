const gulp = require('gulp')
const util = require('gulp-util')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const watch = require('gulp-watch')
const webpack = require('webpack');
const webpackConfig = require('./webpack.config')

gulp.task('default', ['webpack', 'sass', 'fonts'])

gulp.task('webpack', (callback) => {
  webpack(webpackConfig, (error, stats) => {
    if(error) {
      throw new gutil.PluginError('webpack', err)
    }
    util.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }))
    callback()
  })
})

gulp.task('sass', () => {
  return gulp
    .src('sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('public/stylesheets'))
})

gulp.task('fonts', () => {
  return gulp
    .src('node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.*')
    .pipe(gulp.dest('public/fonts/bootstrap'))
})

gulp.task('watch-webpack', ['webpack'], () => {
  return watch('javascript/**/*.js', () => {
    gulp.start('webpack')
  })
})

gulp.task('watch-sass', ['sass'], () => {
  return watch('sass/**/*.scss', () => {
    gulp.start('sass')
  })
})
