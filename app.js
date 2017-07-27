// 1. 实现根据不同路由，返回不同的模板文件
// 2. 封装渲染 html 网页 和 静态资源的方法
//  -  把读取文件，渲染的代码封装到一个方法中
//  - 把 render 方法挂载到 res 对象上
// 3. 读取用户 get 方式提交数据，并将其保存到 data.json 文件中
// 4. 读取用户 post 方式提交的数据
// 5. 封装读取 data.json 文件的代码 和 封装获取 post 数据的代码
// 6. 在 index 页面中渲染数据
// 7. 渲染 details 页面

// 1. 加载 http 模块
var http = require('http');
var router = require('./router.js');
var config = require('./config.js');
var context = require('./context.js');

// url 核心模块
// 作用： 把get请求的查询字符串转换为json对象 方便以后使用

// 创建 http 服务，并监听 request 事件
var server = http.createServer(function(req, res){
  
  // 在 context 模块中扩展 req 和 res 模块
  context(req, res);

  // 调用路由模块
  router(req, res);

}).listen(config.port, function(){
  console.log('http://localhost:' + config.port);
})