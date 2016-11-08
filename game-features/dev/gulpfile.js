/**
 * Created by WALLE on 2016/10/20.
 */
var gulp = require('gulp'); //本地安装gulp所用到的地方
//加载gulp-load-plugins插件，并马上运行它
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');//服务器
var port = 4444;//端口号
var deveSrc = "res/";//存储开发目录
var destSrc = "../public/res";//存储线上目录
var cssmin = "";//存储改动的less
var jsmin = "";//存储改动的js
var imgmin = "";//存储改动的img
//定义一个testLess任务（自定义任务名称）
gulp.task('testLess', function () {//less-css-css.min
    gulp.src(deveSrc + "**/" + cssmin + ".less") //该任务针对的文件
        .pipe(plugins.plumber({errorHandler: plugins.notify.onError('Error: <%= error.message %>')}))
        .pipe(plugins.less()) //该任务调用的模块
        //.pipe(gulp.dest(destSrc)) //将会在src/css下生成index.css
        .pipe(plugins.minifyCss()) //兼容IE7及以下需设置compatibility属性 .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(plugins.rename(function(path) {
            path.basename += ".min";
            console.log(path.basename);
        }))
        .pipe(gulp.dest(destSrc));
});
//定义一个testSass任务（自定义任务名称）
gulp.task('testSass', function () {//less-css-css.min
    gulp.src(deveSrc + "**/" + cssmin + ".scss") //该任务针对的文件
        .pipe(plugins.plumber({errorHandler: plugins.notify.onError('Error: <%= error.message %>')}))
        .pipe(plugins.sass()) //该任务调用的模块
        //.pipe(gulp.dest(destSrc)) //将会在src/css下生成index.css
        .pipe(plugins.minifyCss()) //兼容IE7及以下需设置compatibility属性 .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(plugins.rename(function(path) {
            path.basename += ".min";
            console.log(path.basename);
        }))
        .pipe(gulp.dest(destSrc));
});

gulp.task("jsmin", function () {//js-js.min
    gulp.src(deveSrc + "**/" + jsmin + ".js")
        .pipe(plugins.plumber({errorHandler: plugins.notify.onError('Error: <%= error.message %>')}))
        /*.pipe(plugins.uglify({
            mangle: false,//类型：Boolean 默认：true 是否修改变量名
            compress: true//类型：Boolean 默认：true 是否完全压缩
        }))*/
        .pipe(plugins.rename(function(path) {
            path.basename += ".min";
            console.log(path.basename);
        }))
        .pipe(gulp.dest(destSrc));
});
gulp.task("images",function() {//img-img.min
    gulp.src(deveSrc + "**/" + imgmin + ".+(jpeg|jpg|png)")
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(destSrc));
    /*{
     progressive: true,
     use: [plugins.pngquant({quality: '65-80'})]
     }*/
});

gulp.task('default',function() {//定义默认任务
    cssmin = "*";
    gulp.run("testLess");
    gulp.run("testSass");
    jsmin = "*";
    gulp.run("jsmin");
    imgmin = "*";
    gulp.run("images");
});

gulp.task('testWatch', function () {
    gulp.watch(deveSrc + 'css/**/*.less',function(event) {//监听css
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        var name = event.path.replace(/\\/g, "-");
        //cssmin = event.path;
        cssmin = name.split("-")[name.split("-").length - 1].split(".")[0];
        console.log("cssmin=======",cssmin);
        gulp.run("testLess");
    });
    gulp.watch(deveSrc + 'css/**/*.scss',function(event) {//监听css
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        var name = event.path.replace(/\\/g, "-");
        //cssmin = event.path;
        cssmin = name.split("-")[name.split("-").length - 1].split(".")[0];
        console.log("cssmin=======",cssmin);
        gulp.run("testSass");
    });
    gulp.watch(deveSrc + 'js/**/*.js',function(event) {//监听js
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        var name = event.path.replace(/\\/g, "-");
        //jsmin = event.path;
        console.log("name==============",name);
        jsmin = name.split("-")[name.split("-").length - 1].split(".")[0];
        console.log("jsmin=======",jsmin);
        gulp.run("jsmin");
    });
    gulp.watch(deveSrc + 'img/**/*',function(event) {//监听img
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        var name = event.path.replace(/\\/g, "-");
        //imgmin = event.path;
        imgmin = name.split("-")[name.split("-").length - 1].split(".")[0];
        console.log("imgmin======",imgmin);
        //console.log(event.path.basename);
        gulp.run("images");
    });
    browserSync.init(['res/**/*',  '../views/*.html'], {// 实时同步到浏览器
        // 代理模式
        proxy: "http://localhost:" + port
    });
});
