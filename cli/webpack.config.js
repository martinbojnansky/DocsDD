const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: 'eval-source-map',
  mode: 'development',
  entry: './src/cli.ts',
  output: {
    publicPath: '',
    filename: 'cli.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')]
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/templates'),
          to: path.resolve(__dirname, './dist/templates/[name]'),
          toType: 'template',
        }
      ]
    })
  ],
  target: 'node',
}