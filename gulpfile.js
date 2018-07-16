var gulp        = require('gulp');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var minifyCss   = require('gulp-clean-css');
var autoprefixer= require('gulp-autoprefixer');
var minifier    = require('gulp-html-minifier');
var imagemin    = require('gulp-imagemin');
var jshint      = require('gulp-jshint');
var replace     = require('gulp-replace');

var seajsconcat = require("gulp-seajs-concat");
var transport   = require("gulp-seajs-transport");
var combojs     = require('gulp-seajs-combo');

var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var rev          = require('gulp-rev'); //对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //路径替换
var runSequence  = require('run-sequence'); //保证执行顺序
var gutil        = require('gulp-util');

var NODE_ENV  =  (''+ process.env.NODE_ENV + '').replace(/\s/g,'');

console.log("**************"+NODE_ENV+"*****************");

//***********************************开发环境用***************************************//

var jsHintOpt = {
    debug : true,
    // maxerr: true,
    newcap: true,
    onevar: true,
    undef : true,
    unused: true,
};

gulp.task('compressjs', function() {
  gulp.src('./src/lib/*.min.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./src/lib'))
});


 //gulp.task('jshint',function(){
 //    gulp.src('./src/module/**/*.js')
 //    .pipe(jshint())
 //    .pipe(jshint.reporter('default'))
 //});

// 静态服务器
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./src"
            // https: true  // 需要https时开启
        },
        port: 9090
        // open: 'external',           // 需要域名时开启
        // host: 'dev.toobei.com'      // 需要域名时开启
    });
    //gulp.watch("./src/module/**/*.js",["jshint"]);
    gulp.watch("./src/**/*.{html,css,js}").on('change',reload);
});

gulp.task('dev', ['compressjs','browser-sync']);


//***********************************生产环境用***************************************//


gulp.task('concatlibjs', function() {
  gulp.src('./src/lib/*.min.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/lib'))
});

gulp.task('autoprefixer', function() {
  gulp.src('./src/**/*.css')
    .pipe(autoprefixer({browsers:['> 1%','last 5 versions','ie 6-11','Firefox >= 20']}))  
    .pipe(replace(/\.(png)/g,'.png?v='+Date.now())) 
    .pipe(replace(/\.(jpg)/g,'.jpg?v='+Date.now())) 
    .pipe(replace(/\.(gif)/g,'.gif?v='+Date.now())) 
    .pipe(minifyCss())
    .pipe(gulp.dest('./dist'))
});

gulp.task('concatcss', function() {
  gulp.src(['./src/css/reset.css','./src/css/public.css'])
    .pipe(concat('common.css'))
    .pipe(replace(/\.(png)/g,'.png?v='+Date.now())) 
    .pipe(replace(/\.(jpg)/g,'.jpg?v='+Date.now())) 
    .pipe(replace(/\.(gif)/g,'.gif?v='+Date.now())) 
    .pipe(minifyCss())
    .pipe(gulp.dest('./dist/css/'))
});


gulp.task('minifier', function() {
  gulp.src('./src/**/*.html')
    .pipe(replace(/\.(css)/g,'.css?v='+Date.now())) 
    .pipe(replace(/\.(png)/g,'.png?v='+Date.now())) 
    .pipe(replace(/\.(jpg)/g,'.jpg?v='+Date.now())) 
    .pipe(replace(/\.(gif)/g,'.gif?v='+Date.now()))     
    .pipe(minifier({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
});

gulp.task('sequence', function (done) {
    condition = false;
    runSequence(
        ['autoprefixer'],
        ['concatcss'],
        ['minifier'],
        done);
});

gulp.task('imagemin', function() {
  gulp.src('./src/**/*.{png,jpg,gif}')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist'))
});

gulp.task('componentjs', function() {
  gulp.src('./src/component/**/*.js')
    .pipe(uglify({mangle: { except: ['require', 'exports', 'module', '$'] }}))
    // .pipe(uglify({mangle:false}))
    .pipe(gulp.dest('./dist/component'))
});


gulp.task('configjs', function() {
  gulp.src('./src/config/*.js')
    .pipe(uglify({mangle: { except: ['require', 'exports', 'module', '$'] }}))
    .pipe(replace('__ENV__', NODE_ENV))
    .pipe(gulp.dest('./dist/config'))
});

gulp.task('modulejs', function() {
  gulp.src('./src/module/**/*.js')
    .pipe(uglify({mangle: { except: ['require', 'exports', 'module', '$'] }}))
    .pipe(gulp.dest('./dist/module'))
});

gulp.task('utiljs', function() {
  gulp.src('./src/util/*.js')
    .pipe(uglify({mangle: { except: ['require', 'exports', 'module', '$'] }}))
    .pipe(gulp.dest('./dist/util'))
});

gulp.task('browser', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        port: 9000
    });
});

gulp.task('build', [
    'concatlibjs',
    // 'autoprefixer',
    // 'concatcss',
    // 'minifier',
    'sequence',
    'componentjs',
    'configjs',
    'modulejs',
    'utiljs',
    'imagemin',
    'browser'
]);
