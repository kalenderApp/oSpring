var mconfig = require("../models/mconfig.js");

exports.config = function(app) {
  if (!app.locals.config) {
    mconfig.getConfig(function(err, config) {
      if (!err) {
        app.locals.config = config;
      } else {
        //app.render("500",{"title":"获取系统配置错误，请重试！"});
        console.log("Please visit /install to install oSpring，if has been installed，get the system config failed,Please try again！ Code:10000");
        console.log("请访问 /install 进行安装 oSpring 博客，如果已经安装，则获取系统配置错误，请重试！代码：10000");
      }
    });
  }
};

exports.saveConfig = function(req, res) {
  if (req.body['title'] && req.body['description']) {
    var newconfig = new mconfig({
      'title'       : req.body['title'],
      'description' : req.body['description'],
      'canregister' : req.body['canregister'] || 0,
      'role'        : req.body['role'] || 1,
      'pages'       : req.body['pages'] || 10,
      'createtime'  : req.body['createtime'] || (new Date).getTime()
    });

    newconfig.saveConfig(function(err) {
      if (!err) {
        res.send('{"code":1,"msg":"保存成功！"}');
      } else {
        res.send('{"code":0,"msg":"保存失败！"}');
      };
    });

  }else{
    res.send('{"code":0,"msg":"站点标题和站点描述都不可以为空！"}');
  };
};



// 系统错误页面
exports.notFound = function(req,res) {
  res.status(404);
  res.render("404", {"title" : "404 页面！"});
}

exports.error = function(req,res) {
  res.status(500);
  res.render("500", {"title" : "500 服务器错误！"});
}