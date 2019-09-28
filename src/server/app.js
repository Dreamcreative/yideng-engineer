import 'module-alias/register';
import Koa from 'koa';
import config from "@config";
import render from 'koa-swig';
import { wrap } from "co";
import serve from 'koa-static';
import errorHandler from "./middlewares/errorHandler";
const { error } = errorHandler;
import { configure, getLogger } from 'log4js';
const { viewDir, staticDir, port, cache } = config;
import { createContainer, Lifetime } from "awilix";
import { loadControllers, scopePerRequest } from "awilix-koa";
const app = new Koa();
//构建容器
const container = createContainer();
container.loadModules([__dirname + ["/services/*.js"]], {
    formatName: "camelCase",
    resolverOptions: {
        lifetime: Lifetime.SCOPED
    }
});
//把容器和路由最终合并到一起
app.use(scopePerRequest(container));
configure({
    appenders: { cheese: { type: 'file', filename: __dirname + '/logs/yd.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = getLogger('cheese');
app.context.logger = logger;
app.context.render = wrap(render({
    root: viewDir,
    autoescape: true,
    cache,
    ext: 'html',
    varControls: ["[[", "]]"],
    writeBody: false
}));
app.use(serve(staticDir));
//容错处理中心
error(app);
//加载所有的路由
app.use(loadControllers(__dirname + "/controllers/*.js"));
app.listen(port, () => {
    console.log("服务启动成功🍺");
});
app.on("error", (err) => {
    logger.error(err);
})
process.on("uncaughtException", function(a) {
    // g.notifyError(a, {
    //     type: "uncaughtError"
    // }, function() {
    //     process.exit(1)
    // })
}),
process.on("unhandledRejection", function(a) {
    // g.notifyError(a, {
    //     type: "uncaughtError"
    // })
});