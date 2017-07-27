var path = require('path');

module.exports = {
  port: 9997,
  viewPath: path.join(__dirname, 'views'),
  dataPath: path.join(__dirname, 'data', 'data.json')
};