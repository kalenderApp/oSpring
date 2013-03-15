var mongodb = require("./db");

function Config(config){
  if (typeof config != 'object') {
    return
  } else {
    this.title       = config.title;
    this.description = config.description;
    this.canregister = config.canregister;
    this.role        = config.role;
    this.pages       = config.pages
    this.createtime  = config.createtime;
  }
}

module.exports = Config;

Config.getConfig = function(callback){
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('config', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.findOne({},function(err,config){
        mongodb.close();
        if (!err && config) {
          callback(null,new Config(config));
        }else{
          callback(err,new Config());
        }
      });
    });
  })
}
Config.prototype.saveConfig = function(callback){
  var config = this;
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    // 读取 users 集合
    db.collection('config', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
    collection.insert(config,function(err){
          mongodb.close();
          if (err) {
            callback(err);
          } else {
            callback(null);
          };

        });
      //mongodb.close();
      //callback(err);
    });
  })
};

Config.prototype.modifyConfig = function(post_id,callback) {
  var post = {
    //_id           : this._id || null,
    post_title    : this.post_title,
    pt_content    : this.pt_content,
    post_cat      : this.post_cat,
    post_tag      : this.post_tag,
    post_time     : this.post_time || (new Date).getTime(),
    post_owner    : this.post_owner
  }
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    // 读取 users 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
    // 为 name 属性添加索引
    //collection.ensureIndex("_id");
    // 写入 post 文档
    collection.update({_id: new require('mongodb').ObjectID(post_id)},{"$set":{
        post_title : post.post_title,
        pt_content : post.pt_content,
        post_cat   : post.post_cat,
        post_tag   : post.post_tag,
        post_time  : post.post_time,
        post_owner : post.post_owner
      }});
    callback(null);
    mongodb.close();
    });
  })
};