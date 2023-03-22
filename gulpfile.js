const gulp = require("gulp"); //Импортируем сам gulp
const webpack = require("webpack-stream"); //Импорт Webpack для компиляции кода
const sass = require('gulp-sass')(require('sass'));//import sass
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const dist = "E:/OSPanel/domains/project/admin"; // Куда отправлять файлы
const prod = "./build/"
//Копирование html по указаному пути
gulp.task("copy-html", () => { // Создаем таск для галпа чтобы он копировал файл html и отправлял по указанному адресу
    return gulp.src("./app/src/index.html")// src - берем путь где лежит файл
                .pipe(gulp.dest(dist)); // pipe - продолжает цепочку, dest - берет файл и копирует по указанному в скобках пути
});

//Компиляция js в один файл
gulp.task("build-js", () => {
  return gulp.src("./app/src/main.js")
                  .pipe(webpack({ // Настройки для компиляции
                    mode: "development",
                    output:{ //куда будет выводиться конечный результат
                      filename: "script.js"
                    },
                    watch:false,
                    devtool: "source-map",
                    module: { // скопировано из babel loader docs
                      rules: [
                        {
                          test: /\.m?js$/,
                          exclude: /node_modules/,
                          use: {
                            loader: 'babel-loader',
                            options: {
                              presets: [
                                ['@babel/preset-env', { debug:true, corejs:3, useBuiltIns:"usage", targets: "defaults" }],
                                "@babel/react"
                              ]
                            }
                          }
                        }
                      ]
                    }
                  }))
                  .pipe(gulp.dest(dist))
})

//Компилируем scss в css
gulp.task("build-sass", () => {
  return gulp.src("./app/scss/style.scss")
              .pipe(sass().on('error', sass.logError)) //Обработчик если вдруг ошибка компиляции то выводить логи
              .pipe(gulp.dest(dist));
});

//Копируем все файлы с любыми расширениями из любых папок в api на сервер
gulp.task("copy-api", () => {
  gulp.src("./app/api/**/.*")
        .pipe(gulp.dest(dist + "/api"));
  return gulp.src("./app/api/**/*.*")
              .pipe(gulp.dest(dist + "/api"));
});

//Также, копирование из папки assets
gulp.task("copy-assets", () => {
  return gulp.src("./app/assets/**/*.*")
              .pipe(gulp.dest(dist + "/assets"));
});

//Смотрит если какой-то файл был обновлен и сохранен автоматически отправлять на сервер
gulp.task("watch", () => {
  gulp.watch("./app/src/index.html", gulp.parallel("copy-html"));
  gulp.watch("./app/assets/**/*.*", gulp.parallel("copy-assets"));
  gulp.watch("./app/api/**/*.*", gulp.parallel("copy-api"));
  gulp.watch("./app/scss/**/*.scss", gulp.parallel("build-sass"));
  gulp.watch("./app/src/**/*.js", gulp.parallel("build-js"));
});

//
gulp.task("build", gulp.parallel("copy-html", "copy-assets", "copy-api", "build-sass", "build-js"));
//Продакшн
gulp.task("prod", () => {
  gulp.src("./app/src/index.html") 
      .pipe(gulp.dest(prod));

  gulp.src("./app/api/**/.*")
      .pipe(gulp.dest(prod + "/api"));
  gulp.src("./app/api/**/*.*")
      .pipe(gulp.dest(prod + "/api"));

  gulp.src("./app/assets/**/*.*")
      .pipe(gulp.dest(prod + "/assets"));


  gulp.src("./app/src/main.js")
      .pipe(webpack({ // Настройки для компиляции
        mode: "production",
        output:{ //куда будет выводиться конечный результат
          filename: "script.js"
        },
        module: { // скопировано из babel loader docs
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    ['@babel/preset-env', { debug:false, corejs:3, useBuiltIns:"usage", targets: "defaults" }],
                    "@babel/react"
                  ]
                }
              }
            }
          ]
        }
      }))
      .pipe(gulp.dest(prod));


  return gulp.src("./app/scss/style.scss")
        .pipe(sass().on('error', sass.logError)) //Обработчик если вдруг ошибка компиляции то выводить логи
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(prod));
});

//Один раз пишем gulp и оно делает все что нужно, отправляя на сервер все файлы после сохранений
gulp.task("default", gulp.parallel("watch", "build"));
