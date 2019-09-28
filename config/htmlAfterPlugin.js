// webpack插件
const pluginName = "htmlAfterPlugin";
const assetsHelp = data => {
  let js = [];
  const dir = {
    js: item => `<script src="${item}"><script>`
  };
  for (let item of data.js) {
    js.push(dir.js(item));
  }
  return {
    js
  };
};
class htmlAfterPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
        pluginName,
        htmlPluginData => {
          // console.log("webpack 数据", htmlPluginData);
          let _html = htmlPluginData.html;
          const result = assetsHelp(htmlPluginData.assets);
          // console.log("webpack 数据", result);
          _html = _html.replace(/@components/g, "../../../components");
          _html = _html.replace("<!--injectjs-->", result.js.join(""));
          htmlPluginData.html = _html;
        }
      );
    });
  }
}
module.exports = htmlAfterPlugin;
