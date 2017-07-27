var url = require('url');
var fs = require('fs');
var mime = require('mime');
var _ = require('underscore');




module.exports = function(req, res) {
  // 1.为req 对象扩展一个属性
  var urlObj = url.parse(req.url.toLowerCase(), true);
  req.query = urlObj.query;
  req.pathname = urlObj.pathname;

  reqBody(req);

  res.render = function (fileName, tplData) {
    fs.readFile(fileName, function(err, data){
          if(err){
            throw err;
          }
          // 设置动态mime类型
          res.setHeader('Content-Type', mime.lookup(fileName));
          // 渲染之前要判断一下是否需要进行模板替换操作
          if(tplData) {
            // 如果要是有模板数据 就进行模板替换
            var compiled = _.template(data.toString());
            data = compiled(tplData);
          }
          res.end(data);
      })
    }
    function reqBody (req) {
      var arr = [];
      req.on('data', function(chunk) {
        arr.push(chunk);
      });
      req.on('end', function() {
        var buffer = Buffer.concat(arr);
        req.body = buffer;
      })
    }
}