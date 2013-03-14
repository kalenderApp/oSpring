var musers = require("../models/musers.js");
var crypto = require('crypto');



exports.getRPage = function(req,res){
	res.render("register",{"title":"用户注册"});
}
exports.getLPage = function(req,res){
	res.render("login",{"title":"用户登陆"});
}
exports.login = function(req,res,app){
	//console.log(req.body);
	if ( req.body["email"] && req.body["password"] && req.body["password"].length >= 6 ) {
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		var user = {"email":req.body["email"],"password":password};
		musers.getUser(user,function(err,result){
			if (!err && result.email) {
				res.send('{"code":1,"msg":"登陆成功！"}');
				//console.log(result);
				//console.log("app.locals");
				console.log(app.locals.config);
				req.session.users = result;
				//app.locals.users  = req.session.users;
				console.log(app.locals.users);
			} else {
				res.send('{"code":0,"msg":"登陆失败！"}');
			};
		});
	} else {
		res.send('{"code":0,"msg":"请输入正确的登陆信息！"}');
	};
}

exports.register = function(app,req,res){
	if (req.body['username'] && req.body['email'] && req.body['password'].length >=6 && req.body['password'] && req.body['repassword'] && req.body['password'] === req.body['repassword']) {
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		var newuser = new musers({
			'username'   : req.body['username'],
			'email'      : req.body['email'],
			'password'   : password,
			'power'      : app.locals.config.role || req.body['power'] || 3,
			'status'     : req.body['status'] || 0,  
			'createtime' : req.body['createtime'] || (new Date).getTime()
		});
        musers.getUser(newuser,function(err,result){
            if(err){
                res.send('{"code":"0","msg":"注册失败！"}');
            }else if(result.email){
                res.send('{"code":"0","msg":"用户已存在！"}');
            }else{
                newuser.saveUser(function(err,newuser){
                    if (!err) {
                        res.send('{"code":1,"msg":"注册成功！"}');
                    } else {
                        res.send('{"code":0,"msg":"注册失败！"}');
                    };
                });
            }
        })
	}else{
		res.send('{"code":0,"msg":"请输入正确的注册信息！"}')
	};

}