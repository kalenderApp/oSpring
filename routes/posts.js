var mposts = require("../models/mposts.js");

exports.index = function(req, res, app){
  mposts.getPosts(function(err, result){
  if (!err && result.length > 0) {

  }
  });
};