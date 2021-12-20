const webpack = require('webpack');
const path = require('path');

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
      banner: '#!/usr/bin/env node'
    })
  ],
  target: 'node',
}