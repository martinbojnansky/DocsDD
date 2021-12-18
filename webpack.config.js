const path = require('path');
// const CopyPlugin = require("copy-webpack-plugin");

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
    // new CopyPlugin({
    //   patterns: [
    //      { from: "src/index.html", to: "index.html" },
    //   ],
    // }),
  ],
  target: 'node',
}