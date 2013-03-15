
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , users = require('./routes/users')
  , posts = require('./routes/posts')
  , config = require('./routes/config')
  , configure = require('./configure')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(configure.cookiesecret));
  app.use(express.session());
  app.use(app.router);
  config.config(app);  // 启动网站时，在数据库中读取配置
  app.locals.session = false; // session 全站状态判断
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// 首页
app.get('/',function(req, res){
  if (app.locals.config.title) {
    posts.index(req, res, app);
  } else {
    res.redirect("/install");
  }
});

// 页面 如果没有输入页码 是否和输入页码合并？
app.get('/pages/',function(req, res){
  console.log(req.params);
  if (app.locals.config.title) {
    posts.index(req, res, app);
  } else {
    res.redirect("/install");
  }
});

// 页面 如果有输入页码 是否和未输入页码合并？
app.get('/pages/:page?',function(req, res){
  console.log(req.params);
  if (app.locals.config.title) {
    posts.index(req, res, app);
  } else {
    res.redirect("/install");
  }
});

// 登出
app.get('/logout',function(req, res){
    req.session.users = null;
    app.locals.session = false;
    res.redirect("/");
});

// 注册页面
app.get('/register',function(req,res){
  isLogin(app,req,res,function(){res.redirect("/")},users.getRPage)
})

// 注册
app.post('/register',function(req,res){
  isLogin(app,req,res,function(req,res){
          res.send({"code":0,"msg":"请退出登陆后注册！"});return
    },users.register)
})

// 登陆页面
app.get('/login',function(req,res){
  isLogin(app,req,res,function(){res.redirect("/")},users.getLPage)
});

// 登陆
app.post('/login',function(req,res){
  isLogin(app,req,res,function(req,res){
            res.send('{"code":0,"msg":"重复登录！"}');return
    },users.login);
})

// 博客安装，系统及管理员设置
app.post('/config',function(req,res){config.saveConfig(req,res)});
app.post('/admin',function(req,res){users.register(app,req,res)});

// 错误页面自定义
app.get('/404', config.notFound);
app.get('/500', config.error);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


function isLogin(app,req,res,callbakture,callbakfalse){
  if (req.session.users) {
    app.locals.session = true;
    if(callbakture){
        callbakture(req,res,app);
    }
  } else {
    app.locals.session = false;
    if(callbakfalse){
        callbakfalse(req,res,app);
    }
  };
}