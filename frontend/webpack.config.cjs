const path = require("path");
const dotenv = require('dotenv');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const developmentConfig = require("./webpack/webpack.development");
const productionConfig = require("./webpack/webpack.production");
const merge = require("lodash/merge");
const iconsManifest = require("./assets/icons/manifest.json");

const env = dotenv.config({
  path: path.resolve(__dirname, '../.env')
}).parsed || {};

Object.keys(env).reduce((prev, key) => {
    prev[`process.env.${key}`] = JSON.stringify(env[key]);
    return prev;
}, {});

const config = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "../public/static"),
    filename: "scripts/[name].[contenthash].js",
    publicPath: "/static/",
  },
  resolve: {
    extensions: [".ts", ".js", ".jsx", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript"
            ]
          }
        }
      },
      {
        test: /\.jsx$/,
        use: "babel-loader",
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
      fileName: "../manifest.json",
      publicPath: "/static/",
      generate: (seed, files) => {
        const manifest = {
          name: iconsManifest.name,
          icons: iconsManifest.icons,
        };

        files.forEach((file) => {

          if (file.name === "main.js") {
            manifest.js = file.path;
          }

          if (file.name === "main.css") {
            manifest.css = file.path;
          }

        });

        return manifest;
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "assets/icons",
          to: "icons",
          filter: (resourcePath) => {
            const allowed = ['.png', '.ico'];
            return allowed.some(ext => resourcePath.endsWith(ext));
          },
        }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "assets/icons",
          to: "../",
          filter: (resourcePath) => {
            const allowed = ['.xml'];
            return allowed.some(ext => resourcePath.endsWith(ext));
          },
        }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "assets/images",
          to: "images",
          filter: (resourcePath) => {
            const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
            return allowed.some(ext => resourcePath.endsWith(ext));
          },
        }
      ]
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: "assets/fonts",
    //       to: "fonts",
    //       filter: (resourcePath) => {
    //         const allowed = ['.woff', '.woff2', '.ttf', '.eot'];
    //         return allowed.some(ext => resourcePath.endsWith(ext));
    //       },
    //     }
    //   ]
    // }),
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "../index.html",
    }),
  ],
};

let modeConfig = {};
if (process.env.NODE_ENV === "production") {
  modeConfig = merge({}, config, productionConfig.default);
} else {
  modeConfig = merge({}, config, developmentConfig.default);
}

module.exports = modeConfig;
