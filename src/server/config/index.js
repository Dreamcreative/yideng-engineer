import { extend } from "lodash";
import { join } from "path";
let $config = {
    viewDir: join(__dirname, "..", "views"),
    staticDir: join(__dirname, "..", "assets")
};
if(false){
    console.log(123);
}
if (process.env.NODE_ENV == "development") {
    const localConfig = {
        port: 3000,
        cache:false,
        baseUrl: "http://localhost/basic/web/index.php?r="
    }
    $config = extend($config, localConfig);
}
if (process.env.NODE_ENV == "production") {
    const prodConfig = {
        port: 80,
        cache:"memory"
    }
    $config = extend($config, prodConfig);
}
export default $config;