var mongodb = require("./db");

function Users(user){
  if (typeof user != 'object') {
    return
  } else {
    this.username    = user.username;
    this.email       = user.email;
    this.password    = user.password;
    this.power       = user.power;
    this.status      = user.status;
    this.createtime  = user.createtime;
  }
}

module.exports = Users;

Users.getUser = function(user,callback){
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.findOne({"email":user.email},function(err,user){
        mongodb.close();
        if (!err && user) {
          callback(null,new Users(user));
        }else{
          callback(err,new Users());
        }
      });
    });
  })
}
Users.prototype.saveUser = function(callback){
  var user = this;
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    // 读取 users 集合
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
    collection.insert(user,function(err,result){
          mongodb.close();
          if (err) {
            callback(err);
          } else {
            callback(null,result);
          };

        });
    });
  })
};

Users.prototype.modifyUser = function(post_id,callback) {
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