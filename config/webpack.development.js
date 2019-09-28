const CopyPlugin = require("copy-webpack-plugin");
const { join } = require("path");
module.exports = {
  output: {
    filename: "scripts/[name].bundle.js",
    publicPath: "/"
  },
  plugins: [
    new CopyPlugin([
      {
        from: join(__dirname, "../", "src/web/views/books/layouts/layout.html"),
        to: "../views/layouts/layout.html"
      }
    ]),
    new CopyPlugin(
      [
        {
          from: join(__dirname, "../", "src/web/components"),
          to: "../components"
        }
      ],
      {
        ignore: ["*.js", "*.css", ".DS_Store"],
        copyUnmodified: true
      }
    )
  ]
};
