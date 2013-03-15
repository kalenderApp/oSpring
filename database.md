数据库结构

用户集合
users : {
  id         :  , 唯一
  username   :  ,      3 -16 位
  email      :  , 唯一  找回密码
  password   :  ,       md5 6 - 16位
  power      :  ,       1 站长 2 管理员 3 读者
  createtime :  ,       创建时间
  status     :  ,       0 正常 1 禁用 用户状态
} 

系统设置集合
config : {
  id          :  , 唯一
  title       :  ,      网站标题
  description :  ,      网站描述
  canregister :  ,      0 可以注册 1 不可以注册
  role        :  ,      默认角色 和 users 中的 power 对应
  postperpage :  ,      每页文章数 默认 10
  createtime  :  ,      创建时间
}

文章集合
posts : {
  id         :  , 唯一
  title      :  ,       文章标题
  content    :  ,       文章内容
  category   :  ,       文章分类
  tags       :  ,       文章标签
  createtime :  ,       创建时间
  updatetime :  ,       修改时间
  owner      :  ,       作者
}