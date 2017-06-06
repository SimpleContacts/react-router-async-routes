import webpack from 'webpack';
import path from 'path';

module.exports = {
  entry: {
    bootstrap: './example/bootstrap.js',
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
    path: __dirname + '/example/public',
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
};
