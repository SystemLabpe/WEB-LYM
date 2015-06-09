'use strict';

var gulp = require('gulp'),
connect = require('gulp-connect'),
jshint = require('gulp-jshint'),
stylish = require('jshint-stylish'),
inject = require('gulp-inject'),
wiredep = require('wiredep').stream,
gulpif = require('gulp-if'),
minifyCss = require('gulp-minify-css'),
useref = require('gulp-useref'),
uglify = require('gulp-uglify'),
historyApiFallback = require('connect-history-api-fallback');

// Servidor web de desarrollo
gulp.task('server', function() {
  connect.server({
    root: './app',
    hostname: '0.0.0.0',
    port: 8080,
    livereload: true,
    middleware: function(connect, opt) {
      return [ historyApiFallback ];
    }
  });
});

// Servidor web para probar el entorno de producción
gulp.task('server-dist', function() {
  connect.server({
    root: './dist',
    hostname: '0.0.0.0',
    port: 8080,
    livereload: true,
    middleware: function(connect, opt) {
    return [ historyApiFallback ];
    }
  });
});

// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() {
  return gulp.src('./app/js/**/*.js')
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
});

// Preprocesa archivos Stylus a CSS y recarga los cambios
gulp.task('css', function() {
  gulp.src('./app/css/main.css')
  .pipe(connect.reload());
});

// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
  gulp.src('./app/**/*.html')
  .pipe(connect.reload());
});


// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el index.html
gulp.task('inject', function() {
  var sources = gulp.src([ './app/js/**/*.js', './app/css/**/*.css' ]);
  return gulp.src('index.html', { cwd: './app' })
  .pipe(inject(sources, {
    read: false,
    ignorePath: '/app'
  }))
  .pipe(gulp.dest('./app'));
});

// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function () {
  gulp.src('./app/index.html')
  .pipe(wiredep({
    directory: './app/lib'
  }))
  .pipe(gulp.dest('./app'));
});

// Comprime los archivos CSS y JS enlazados en el index.html
// y los minifica.
gulp.task('compress', function() {
  gulp.src('./app/index.html')
  .pipe(useref.assets())
  .pipe(gulpif('*.js', uglify({mangle: false })))
  .pipe(gulpif('*.css', minifyCss()))
  .pipe(gulp.dest('./dist'));
});

// Copia el contenido de los estáticos e index.html al directorio
// de producción sin tags de comentarios
gulp.task('copy', function() {
  gulp.src('./app/index.html')
  .pipe(useref())
  .pipe(gulp.dest('./dist'));
  gulp.src('./app/css/icons/**')
  .pipe(gulp.dest('./dist/css/icons'));
  gulp.src('./app/fonts/**')
  .pipe(gulp.dest('./dist/fonts'));
  gulp.src('./app/lib/font-awesome/fonts/**')
  .pipe(gulp.dest('./dist/fonts'));
  gulp.src('./app/img/**')
  .pipe(gulp.dest('./dist/img'));
  gulp.src('./app/php/**')
  .pipe(gulp.dest('./dist/php'));
});

// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/css/**/*.css'], ['css', 'inject']);
  gulp.watch(['./app/js/**/*.js', './Gulpfile.js'], ['jshint', 'inject']);
  gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('default', ['server', 'inject', 'wiredep', 'watch']);
gulp.task('build', ['compress', 'copy']);
