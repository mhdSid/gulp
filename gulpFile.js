/*
* * * Authored by Mohammad Sidani: mohdsidani@gmail.com
*/

'use strict';

var gulp = require("gulp");
var runSequence = require("run-sequence");
var wiredep = require("wiredep");
var config = require("./gulp.config.js")();
var lazy = require("gulp-load-plugins")({lazy: true});
var del = require("del");

/*
* * * Compile Typescript  files
*/
gulp.task("ts-compiler", function () {
  return gulp.src(config.allts)
    .pipe(lazy.typescript({
      // Generates corresponding .map file. 
      sourceMap : false,
 
      // Generates corresponding .d.ts file. 
      declaration : true,
 
      // Do not emit comments to output. 
      removeComments : false,
 
      // Warn on expressions and declarations with an implied 'any' type. 
      noImplicitAny : false,
 
      // Skip resolution and preprocessing. 
      noResolve : false,
 
      // Specify module code generation: 'commonjs' or 'amd'   
      module : 'amd',
 
      // Specify ECMAScript target version: 'ES3' (default), or 'ES5' 
      target : 'ES5'
  }))
    .pipe(gulp.dest(config.devDest));
});


/*
* * * NgAnnotate   
*/    /*@ngInject*/
gulp.task("dependency-fixer", function () {
  return gulp.src(config.alljs)
          .pipe(lazy.ngAnnotate()) 
          .pipe(gulp.dest(config.devDest));
});


/*
* * * LESS to CSS
*/
gulp.task("less-css", function () {
  return gulp.src(config.allless)
         .pipe(lazy.less())
         .pipe(gulp.dest(config.devDestCss));
});


/*
* * * Auto-Prefixer
*/
gulp.task("auto-prefixer", function () {
    return gulp.src(config.devMainCss)
           .pipe(lazy.autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
           }))
           .pipe(gulp.dest(config.devDest));
});


/*
* * * Minify Html
*/
gulp.task("minify-html", function () {
    return gulp.src(config.allhtml)
           .pipe(lazy.minifyHtml({conditionals: true, spare:true}))
           .pipe(gulp.dest(config.buildDest));
});


/*
* * * Minify Css
*/
gulp.task("minify-css", function () {
    return gulp.src(config.buildCss)
           .pipe(lazy.minifyCss({keepBreaks: false}))
           .pipe(lazy.rename({suffix: '.optimized.min'}))
           .pipe(gulp.dest(config.buildDest));
});


/*
* * * Minify JS
*/
gulp.task("minify-js", function () {
    return gulp.src(config.buildJs)
           .pipe(lazy.stripDebug())
           .pipe(lazy.uglify())
           .pipe(lazy.rename({suffix: '.optimized.min'}))
           .pipe(gulp.dest(config.buildDest));
});


/*
* * * Inject all Bower components into index.html 
*/
gulp.task("bower-injector", function () {
    return gulp.src(config.index)
           .pipe(wiredep.stream())
           .pipe(gulp.dest(""));
});


/*
* * * Inject all JS into index.html
*/
gulp.task("js-injector", function () {                                    
    return gulp.src(config.index)
           .pipe(lazy.inject(gulp.src(config.alljs, {read: false})))
           .pipe(gulp.dest(""));
});


/*
* * * Watches for new .ts files, compiles them, and then adds them to the index.html
*/ 
gulp.task("new-ts-watcher", function () {
    lazy.watch(config.watchTS)
        .on("add", function (path) {
            var index = path.indexOf(config.client);
            var filePath = path.substring(index);
            var suffix = path.substring(path.length - 3);

            console.log("New file has been added " + filePath);
            if (suffix === ".ts") {
              runSequence("ts-compiler", "js-injector");
            }
        })
        .on("unlink", function (path) {
            var index = path.indexOf(config.client);
            var filePath = path.substring(index);
            var suffix = path.substring(path.length - 3);

            console.log("File has been deleted " + filePath);

            if (suffix === ".ts") {
              var jsPath = filePath.replace(".ts", ".js").replace("/app", "./development/app");
              console.log(jsPath)
              
              del(jsPath, function () {
                  gulp.start("js-injector");
              });
            }
            else if (suffix === ".js") {
              var tsPath = filePath.replace(".js", ".ts").replace("/app", "./app");
              console.log(jsPath)
              
              del(tsPath, function () {
                    gulp.start("js-injector");
              });
            }
        });
});


/*
* * * Inject all CSS into index.html
*/
gulp.task("css-injector", function () {
    return gulp.src(config.index)
           .pipe(lazy.inject(gulp.src(config.allcss)))
           .pipe(gulp.dest(""));
});


/*
* * * Watch for changes in typescript files. Delete the old build file, compile the files, and then build the build.js
* * * First Delete the already existing build file so the changes won't be added on top of the file. 
* * * Any changes made to a file will cause the whole file to be added. So first we delete the old build file, then create a new one
*/
gulp.task('ts-watcher', function() {
    gulp.watch(config.allts, function () {
      del(config.buildJs);
      gulp.start("ts-compiler");
  });
});


/*
* * * Watch for changes in less files. Convert from less to css, and then build the main.css
*/
gulp.task('less-watcher', function() {
    gulp.watch(config.allless, function () {
      del(config.buildCss);
      gulp.start("less-css");
  });
});


/*
* * * Browser Sync Starter
*/
gulp.task("browser-sync", startBrowserSync);


/*
* * * Browser Sync function.
*/
function startBrowserSync() {
  var options = {
      proxy: "localhost:" + 9090,
      port: 9090,
      files: config.browserSync,
      ghostMode: {
        clicks: true,
        location: true,
        forms: true,
        scroll: true
      },
      injectChanges: true,
      logFileChanges: true,
      logLevel: "debug",
      logPrefix: "gulp-patterns",
      notify: true,
      reloadDelay: 0,
      browser: "safari"
  };

  if (lazy.browserSync.active) {
    return;
  } 

  gulp.start("less-watcher", function () {
    lazy.browserSync.reload();
  });

  lazy.browserSync(options);
}


/*
* * * Template cache
*/  
gulp.task("template-cache", function () {
    return gulp.src(config.allhtml)
               .pipe(lazy.minifyHtml({empty: true}))
               .pipe(lazy.angularTemplatecache())
               .pipe(gulp.dest(config.buildDest));
});


/*
* * * Compressing Images
*/
gulp.task("images", function () {
    return gulp.src(config.allimg)
               .pipe(lazy.imagemin({optimizationLevel: 5}))
               .pipe(gulp.dest(config.imgDest))
});


/*
* * * Copying fonts to their destination 
*/
gulp.task("fonts", function () {
    return gulp.src(config.allfonts)
               .pipe(gulp.dest(config.fontDest))
});


/*
* * * List all tasks
*/
gulp.task("list-tasks", lazy.taskListing);


/*
* * * Prepare for the development environment.  
*/
gulp.task("env-development", function () {
    runSequence("ts-compiler", 
                "less-css", 
                "auto-prefixer", 
                "bower-injector", 
                "js-injector", 
                "css-injector",
                "ts-watcher", 
                "less-watcher",
                "new-ts-watcher", function () {
                    var assets = lazy.useref.assets();
                    gulp.src(config.index)
                        .pipe(lazy.plumber())
                        .pipe(assets)
                        .pipe(assets.restore())
                        .pipe(lazy.useref())
                        .pipe(gulp.dest(config.dev));
                });
});


/*
* * * Prepare for the building environment. Optimize All. For publishing app.js lib.js app.css lib.css
*/
gulp.task("env-build", ["minify-html", 
                        "images", 
                        "fonts", 
                        "template-cache"
                        ], function () {
    var assets = lazy.useref.assets();
    return gulp.src(config.index)
               .pipe(lazy.plumber())
               .pipe(lazy.inject(gulp.src(config.templates, {read: false}), {starttag: "<!-- inject:templates:js -->"}))
               .pipe(assets)
               .pipe(assets.restore())
               .pipe(lazy.useref())
               .pipe(gulp.dest(config.build))
               .on("end", function () {
                  runSequence("minify-js", "minify-css", "dependency-fixer");
           });
});