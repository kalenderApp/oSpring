exports.index = function(req, res,app){
	if (app.locals.config.title) {
		res.render('index', app.locals.config);
	} else {
		res.redirect("/install");
	};
  
};