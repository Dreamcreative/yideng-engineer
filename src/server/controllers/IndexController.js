const fs = require("fs");
const { resolve } = require("path");
import { route, GET } from "awilix-koa";
@route("/")
class IndexController {
    @route("/")
    @GET()
    async actionIndex(ctx, next) {
        // ctx.body = await ctx.render('Index/home')
        ctx.body = {
            home: "首页数据"
        }
    }
    @route("/test")
    @GET()
    async actionTest(ctx, next) {
        ctx.status = 200;
        ctx.type = "html";
        const task1 = () => {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    resolve(`<script>addHTML("part1","第一次输出<br/>")</script>`);
                }, 1000);
            })
        }
        const task2 = () => {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    resolve(`<script>addHTML("part2","第二次输出<br/>")</script>`);
                }, 2000);
            })
        }
        const filename = resolve(__dirname, "index.html");
        const file1 = fs.readFileSync(filename, "utf-8");
        //demo01 
        // ctx.body = file1;
        //demo02
        // ctx.res.write(file1);
        // ctx.res.end();
        //demo03
        // ctx.res.write(file1);
        // ctx.res.end();
        //demo04
        // function createSSRStream() {
        //     return new Promise((resolve, reject) => {
        //         const stream = fs.createReadStream(filename);
        //         stream.on("error", err => { reject(err) }).pipe(ctx.res);
        //     })
        // }
        // await createSSRStream();
        //demo05
        // function createSSRStream() {
        //     return new Promise((resolve, reject) => {
        //         const stream = fs.createReadStream(filename);
        //         stream.on("data", chunk => { ctx.res.write(chunk) });
        //         stream.on("end", ()=>{
        //             ctx.res.end();
        //         });
        //         stream.on("error", err => { reject(err) });
        //     })
        // }
        // await createSSRStream();
        ctx.res.write(file1);
        const result1 = await task1();
        ctx.res.write(result1);
        const result2 = await task2();
        ctx.res.write(result2);
        ctx.res.end();
    }
}
export default IndexController;