const webpack = require("webpack");
const path = require("path");
module.exports = {
  devtool: "source-map",
  entry: {
    offline: path.join(__dirname, "javascript", "app.js")
  },
  output: {
    path: path.join(__dirname, "public", "javascripts"),
    filename: "app.js" //"[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        include: [
          //path.join(__dirname, '..', 'com.cisco.html', "_js"),
          path.join(__dirname, "javascript")
        ],
        loaders: ["babel"]
      },
      {
        test: /\.html$/,
        loader: "handlebars-loader"
      }
      // {
      //     test: /\.svg$/,
      //     loader: 'svg-inline'
      // }
    ]
  },
  resolve: {
    root: [
      path.resolve(path.join(__dirname, "javascript"))
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]
};