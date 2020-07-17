// const defaultConfig = require("./defaultConfig.js");
// console.log(require("./defaultConfig.js"));
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    '/mgr_wholesale',
    createProxyMiddleware({
      target: 'http://dev-mgr-wholesale.highstreet.top', //配置你要请求的服务器地址
      changeOrigin: true,
      pathRewrite: {
        '^/mgr_wholesale': '/mgr_wholesale'
      }
    })
  );
};