const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

module.exports = {
  mode: "production", // minify + optimizations

  entry: {
    main: "./frontend/scripts/render.js",
    style: "./frontend/styles/main.css",
  },

  output: {
    filename: "scripts/[name].[contenthash].js",
    path: path.resolve(__dirname, "public"),
    clean: false,
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash].css",
    }),

    new WebpackManifestPlugin({
      fileName: "manifest.json",
      publicPath: "/static/",
      generate: (seed, files) => {
        const manifest = {};

        files.forEach((file) => {
          if (file.name === "main.js") {
            manifest.js = file.path;
          }
          if (file.name === "style.css") {
            manifest.css = file.path;
          }
        });

        return manifest;
      },
    }),
  ],

  watch: true,

  devtool: false,
};
