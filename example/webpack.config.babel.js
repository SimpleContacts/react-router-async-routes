const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    bootstrap: ['@babel/polyfill', './example/bootstrap.js'],
  },
  devtool: 'source-map',
  devServer: {
    publicPath: '/',
    contentBase: './example',
    proxy: {
      '**': 'http://localhost:8081',
    },
  },
  output: {
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: __dirname + '/public',
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
    <head>
      <style>
        .alert-enter {
          opacity: 0;
          transform: scale(0.9);
        }
        .alert-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 300ms, transform 300ms;
        }
        .alert-exit {
          opacity: 1;
        }
        .alert-exit-active {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 300ms, transform 300ms;
        }
      </style>
    </head>
    <body>
      <div id="app"></div>
    </body>
    `,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            [
              '@babel/env',
              {
                targets: {
                  browsers: ['last 2 versions', 'safari >= 7'],
                },
              },
            ],
            'react',
          ],
          plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-syntax-dynamic-import',
            [
              '@babel/plugin-proposal-object-rest-spread',
              {
                useBuiltIns: true,
              },
            ],
            'transform-es2015-modules-umd',
          ],
        },
      },
    ],
  },
};
