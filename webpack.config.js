const argv = require("yargs-parser")(process.argv.slice(2));
const _model = argv.model || "development";
const _mergeConfig = require(`./config/webpack.${_model}.js`);
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const glob = require("glob");
const { resolve, join } = require("path");
const HtmlAfterPlugin = require("./config/htmlAfterPlugin");
let _entry = {};
let _plugins = [];
//寻找全部的entry
const files = glob.sync("./src/web/views/**/*.entry.js");
for (let item of files) {
  if (/.+\/([a-zA-Z]+-[a-zA-Z]+)\.entry\.js$/g.test(item) == true) {
    let filename = RegExp.$1;
    let [dist, template] = filename.split("-");
    _entry[filename] = item;
    _plugins.push(
      new HtmlWebpackPlugin({
        filename: `../views/${dist}/pages/${template}.html`,
        template: `./src/web/views/${dist}/pages/${template}.html`,
        inject: false,
        chunks: ["runtime", filename]
      })
    );
  }
}
const webpackConfig = {
  entry: _entry,
  output: {
    path: join(__dirname, "./dist/assets"),
  },
  optimization: {
    runtimeChunk: {
      name: "runtime" //提取webpack 公共代码
    }
  },
  plugins: [ ..._plugins,
    new HtmlAfterPlugin()],
  resolve: {
    alias: {
      "@components": resolve(__dirname, "src/web/components")
    }
  }
};

module.exports = merge(_mergeConfig, webpackConfig);
