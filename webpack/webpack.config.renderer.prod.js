const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.config.base.js');

module.exports = Merge(CommonConfig, {
  mode: 'production',
  output: {
    path: path.join(__dirname, '..', 'app/dist'),
    publicPath: './dist/',
    filename: 'renderer.prod.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: './templates/index.nodev.html',
    // }),
  ],
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       sourceMap: true,
  //       parallel: true,
  //       uglifyOptions: {
  //         safari10: true,
  //         compress: {
  //           drop_console: false,
  //         },
  //       },
  //     }),
  //   ],
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //     },
  //   },
  //   noEmitOnErrors: true,
  //   usedExports: true,
  //   concatenateModules: true,
  //   removeAvailableModules: true,
  //   removeEmptyChunks: true,
  //   mergeDuplicateChunks: true,
  //   providedExports: true,
  // },
});
