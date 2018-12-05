import webpack from "webpack";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

module.exports = {
  entry: {
    bootstrap: ["babel-polyfill", "./example/bootstrap.js"]
  },
  devtool: "source-map",
  devServer: {
    publicPath: "/",
    contentBase: "./example",
    proxy: {
      "**": "http://localhost:8081"
    }
  },
  output: {
    publicPath: "/",
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    path: __dirname + "/public"
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
    <head>
      <style>
        .fade-enter {
          opacity: 0.01;
        }

        .fade-enter.fade-enter-active {
          opacity: 1;
          transition: opacity .5s ease-in;
        }

        .fade-appear {
          opacity: 0.01;
        }

        .fade-appear.fade-enter-active {
          opacity: 1;
          transition: opacity .5s ease-in;
        }
      </style>
    </head>
    <body>
      <div id="app"></div>
    </body>
    `
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          babelrc: false,
          presets: [
            [
              "env",
              {
                targets: {
                  browsers: ["last 2 versions", "safari >= 7"]
                }
              }
            ],
            "react"
          ],
          plugins: [
            "babel-plugin-syntax-dynamic-import",
            [
              "transform-object-rest-spread",
              {
                useBuiltIns: true
              }
            ],
            "transform-es2015-modules-umd"
          ]
        }
      }
    ]
  }
};
