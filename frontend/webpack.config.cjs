const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

module.exports = {
  mode: "production",

  entry: {
    main: "./src/scripts/main.ts",
    style: "./src/styles/main.scss",
  },

  output: {
    filename: "scripts/[name].[contenthash].js",
    path: path.resolve(__dirname, "../public"),
    clean: false,
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ],
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
