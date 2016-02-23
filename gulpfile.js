'use strict';

/**
* Dependencias
*/
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    browserSync = require('browser-sync').create(),
    animation = require('postcss-animation'),
    autoprefixer = require('autoprefixer'),
    instagram = require('postcss-instagram'),
    mqpacker = require('css-mqpacker'),
    nano = require('cssnano'),
    safe = require('postcss-safe-parser');

/**
* Variable de entorno.
* En la terminal se puede definir de manera opcional el puerto para cualquiera
* de las tareas watch, un ejemplo de uso sería:
* PORT=8080 gulp watch:all
*/
var PORT = process.env.PORT || 7070;


/**
* Compila los archivos sass hijos directos de la carpeta `scss/`.
* Agrega los prefijos propietarios de los navegadores.
* Los archivos CSS generados se guardan en la carpeta `css/`.
* Minify y optimiza el css.
*/
gulp.task('sass', function() {
  var processors = [
       animation,
       instagram,
       safe,
       mqpacker,
       autoprefixer({
         browsers: ['last 2 versions']
       }),
       nano({
         discardComments: {
           removeAll: true
         }
       })
  ];

  return gulp.src('./scss/*.scss')
     .pipe(sass().on('error', sass.logError, notify.onError()))
     .pipe(plumber())
     .pipe(postcss(processors))
     .pipe(gulp.dest('./css'))
     .pipe(notify({ message: 'Tarea de sass esta completada.' }));
});


/**
* Compila los archivos jade hijos directos de la carpeta `jade/`.
* Los archivos HTML generados se guardan en la carpeta html del proyecto.
*/
gulp.task('jade', function () {
    return gulp.src('./jade/*.jade')
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./html'))
        .on('end', browserSync.reload)
        .pipe(notify({ message: 'Tarea de jade esta completada.' }));
});


/**
* Recarga el navegador
*/
gulp.task('js', function() {
  browserSync.reload('*.js');
});


/**
* Crea un servidor local
* http://localhost:7070
*/
gulp.task('browser-sync', function() {
  browserSync.init({
    port: PORT,
    server: {
      baseDir: "./html"
    },
    ui: {
      port: PORT + 1
    }
  });
});


/**
* Ejecuta la tarea sass y queda escuchando los cambios de todos
* los archivos Sass de la carpeta `scss/` y subcarpetas.
* Admás de minify y optimiza el css compilado de sass.
*/
gulp.task('watch:sass', function() {
  browserSync.watch('./scss/**/*.scss').on('change', function() {
    gulp.start('sass');
  });
});


/**
* Ejecuta la tarea jade y queda escuchando los cambios de todos
* los archivos jade de la carpeta `jade/` y subcarpetas.
*/
gulp.task('watch:jade', function() {
  browserSync.watch('./jade/**/*.jade').on('change', function() {
    gulp.start('jade');
  });
});


/**
* Ejecuta la tarea js y queda escuchando los cambios de todos
* los archivos Javascript.
*/
gulp.task('watch:js', function() {
  browserSync.watch('./js/**/*.js').on('change', function() {
    gulp.start('js');
  });
});


/**
* Ejecuta las tareas browser-sync, watch:sass, watch:jade y watch:js.
*/
gulp.task('watch:all', function() {
  gulp.start('browser-sync');
  gulp.start('watch:sass');
  gulp.start('watch:jade');
  gulp.start('watch:js');
});


/**
* Ejecuta la tarea broweser-sync, watch:sass y watch:jade.
*/
gulp.task('default', function() {
  gulp.start('browser-sync');
  gulp.start('watch:sass');
  gulp.start('watch:jade');
});
