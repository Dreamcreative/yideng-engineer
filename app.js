require('module-alias/register') // 引入别名
const Koa = require("koa");
const app = new Koa();
const config = require("@config/index")
const controllersInit = require("./controllers");
const render = require("koa-swig") // 引入swig 模板
const co = require('co');
const serve = require('koa-static'); 
const errorHandle = require("./middlewares/errorHandle"); //引入错误处理
const log4js = require('log4js');
log4js.configure({
  appenders: { cheese: { type: 'file', filename: './logs/error.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese');
app.use(serve(config.staticDir));
app.context.logger = logger;
//容错处理中心,对node的处理 ,对页面的错误无效
errorHandle.error(app);
app.context.render = co.wrap(render({
  root:config.viewDir,
  autoescape: true,
  cache: false, // disable, set to false
  ext: 'html',
  varControls:["[[","]]"],
  // ...your setting
  writeBody: false
}));
 
controllersInit(app);
app.listen(config.port,()=>{
    console.log("服务启动成功，端口号为 ",config.port)
})
//如果上面的错误监听失效，也可以使用下面的方式监听
app.on("error",(err)=>{
  logger.error(err)
})