var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: './client/js/index.js',
  output: {
    filename: 'bundle.js',
      path: path.resolve(__dirname, 'client/dist')
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "imports-loader?THREE=three" },
      { test: /\.js$/, loader: "imports-loader?$=jquery" },
    ]
  }
}
