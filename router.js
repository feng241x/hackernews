// 这个是 路由 操作模块
// 该模块中包含了所有的路由操作

var handler = require('./handler.js');

module.exports = function(req, res) {
  // 让 reqUrl 中保存的值 变成 pathname
  var reqUrl = req.pathname;
  // 把 /favicon.ico 的请求 替换成 
  req.url = reqUrl = (reqUrl === '/favicon.ico') ? '/resources/images/y18.gif' : reqUrl;

  // 统一设置响应报文头
  res.setHeader('Content-Type','text/html;charset=utf-8')
  // 判断用户请求 设置路由
  if((reqUrl === '/' || reqUrl === '/index') && req.method.toLowerCase() === 'get'){
    handler.index(req, res);
  } else if (reqUrl === '/details') {
    handler.details(req, res);
  } else if ( reqUrl === '/submit' ) {
    handler.submit(req, res);
  } else if ( reqUrl === '/add' && req.method.toLowerCase() === 'get' ) {
    handler.addGet(req, res);
  } else if ( reqUrl === '/add' && req.method.toLowerCase() === 'post' ) {
    handler.addPost(req, res);
  } else if ( reqUrl.startsWith('/resources') ) {
    handler.resources(req, res);
  }else {
    handler.errors(req, res);
  }
}