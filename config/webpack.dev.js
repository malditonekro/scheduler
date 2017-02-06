var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var webpack = require('webpack');
module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: 'http://localhost:8000/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
},

  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      moment: "moment"
    })
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    proxy:{
      '/api/*' : {
        target: 'http://searchjob.trabajando.com/', 
        changeOrigin: true,
        pathRewrite: {
        '^/api': ''
        }
      },
      '/SOA/*' : {
        target: 'http://wsbcknd.trabajando.com/', 
        changeOrigin: true,
        pathRewrite: {
        '^/SOA': ''
        }
      }
    }
  }
});
