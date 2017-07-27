// 业务模块
// 在该模块中封装了不同请求对应的不同的处理方法

var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var config = require('./config.js');

module.exports = {
  index: function (req, res) {
    // 读取views下的index.html 将其返回给用户
    readDataJson(function(list) {
      res.render(path.join(config.viewPath, 'index.html'), {pageTitle: 'Hacker News Index - News List', list: list});
    })
  },
  details: function (req, res) {
    // 读取views下的datails.html 将其返回给用户
    readDataJson(function(list) {
      // 获取传递过来的id
      // req.query.id (字符串类型)
      // 用来记录在 data.json文件夹中找到当前新闻
      var model;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === parseInt(req.query.id)) {
          model = list[i];
          break;
        }
      }
      if(model) {
        res.render(path.join(config.viewPath, 'details.html'), {list: model});
      } else {
        res.end('No Such Item.')
      }
    })
  },
  submit: function (req, res) {
    res.render(path.join(config.viewPath, 'submit.html'));
  },
  addGet: function (req, res) {
    // 1.要提交数据 先获取数据文件
    fs.readFile(config.dataPath, 'utf-8', function(err, data){
      if(err && err.code !== 'ENOENT'){
        throw err;
      }
      // 2.再将文件数据临时存放在数组中
      var temp = JSON.parse(data || '[]')
      // 3.使用push 方法 将新的数据 追加到临时数组中
      temp.push(req.query);
      // 4.然后将临时数组内的数据 写入到 数据文件
      fs.writeFile(config.dataPath, JSON.stringify(temp), function(err){
        if(err) {
          throw err;
        }
        console.log('文件写入成功！');
        // 设置重定向
        res.statusCode = 302;
        res.statusMessage = 'Found';
        // 设置重定向的路径
        res.setHeader('Location', '/');
        res.end();
      })
    })
  },
  addPost: function (req, res) {
    readDataJson(function(list) {
        // 接下来就可以对 buffer 进行操作了
        // 把 buffer 对象转换成字符串
        var reqBody = req.body.toString('utf8');
        // querystring 通过该模块 可以把一个查询字符串转换为json对象
        reqBody = querystring.parse(reqBody);
        reqBody.id = list.length;
        // 把用户提交的数据 reqBody 保存到 list 中
        list.push(reqBody);
        // 把新的 list 数组再写到 data.json 文件中
        fs.writeFile(config.dataPath, JSON.stringify(list), function(err) {
          if(err) {
            throw err;
          }
          console.log('文件写入成功！')
          // 文件写入成功 将请求重定向到首页
          res.statusCode = 302;
          res.statusMessage = 'Found';
          res.setHeader('Location', '/');
          res.end();
        })
    })
  },
  resources: function (req, res) {
    // 如果请求是以 /resources 开头的 表示请求的是静态资源
    // 如果是静态资源就直接读取文件资源返回用户
    res.render(path.join(__dirname, req.url));
  },
  errors: function (req, res) {
    //404
    res.statusCode = 404;
    res.statusMessage = 'Not Found';
    res.render(path.join(config.viewPath, '404.html'));
  }
}


// 封装 读取 data.json 文件数据的方法
function readDataJson(callback) {
  // 1. 先读取 data.json 文件中的数据, 然后将其转换为 list 数组
  fs.readFile(config.dataPath, 'utf8', function (err, data) {
    // body...
    if (err && err.code !== 'ENOENT') {
      throw err;
    }

   // 将读取到的 data.json 文件中的数据转换为一个数组
   var list = JSON.parse(data || '[]');

   callback(list);

  });
}