const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",

  entry: "./src/index.tsx",

  output: {
    path: path.resolve(__dirname, "../public"),
    filename: "scripts/[name].[contenthash].js",
    publicPath: "/",
    clean: false,
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

      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name].[ext]"
        }
      },

      // {
      //   test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
      //   type: "asset/resource",
      //   generator: {
      //     filename: "assets/images/[name].[ext]"
      //   }
      // },

      {
        test: /\.(woff|woff2|ttf|eot)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name].[ext]"
        }
      }
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash].css",
    }),

    new WebpackManifestPlugin({
      fileName: "manifest.json",
      publicPath: "/",

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

    new CopyWebpackPlugin({
      patterns: [
        {
          from: "assets/icons",
          to: "../public/assets/icons"
        }
      ]
    }),

    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
  ],

  watch: true,

  devtool: false,
};
