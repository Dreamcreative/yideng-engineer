import cheerio from "cheerio";
import { Readable } from "stream";
import { route, GET } from "awilix-koa";
@route("/books")
class BooksController {
    constructor({ booksServices }) {
        this.booksServices = booksServices;
    }
    @route("/list")
    @GET()
    async actionIndex(ctx, next) {
        ctx.status = 200;
        ctx.type = "html";
        const result = await this.booksServices.getList();
        //lru swig
        const html = await ctx.render('books/pages/list', {
            result
        });
        if (ctx.request.header["x-pjax"]) {
            console.log("站内切");
            const $ = cheerio.load(html);
            // let _result = "";
            $(".pjaxcontent").each(function () {
                // _result += $(this).html();
                ctx.res.write($(this).html());
            });
            $(".layload-js").each(function () {
                //<script>init({$(this).attr("src")})</script>
                // ctx.res.write(`<script  src="${$(this).attr("src")}"></script>`);
                ctx.res.write(`<script>initResoure("${$(this).attr("src")}")</script>`);
            });
            // ctx.body = _result;
            ctx.res.end();
        } else {
            console.log("直接刷新")
            // ctx.body = html;
            function createSSRStream() {
                return new Promise((resolve, reject) => {
                    const htmlStream = new Readable();
                    htmlStream.push(html);
                    htmlStream.push(null);
                    htmlStream.on("error", err => { reject(err) }).pipe(ctx.res);
                })
            }
            await createSSRStream();
        }
        // console.log("返回的值", result);
        // ctx.body = result;
    }
    @route("/create")
    @GET()
    async actionCreate(ctx) {
        ctx.body = await ctx.render('books/pages/create');
    }
}
export default BooksController;