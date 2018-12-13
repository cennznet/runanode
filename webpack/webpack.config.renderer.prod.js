const path = require('path');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.config.base.js');

module.exports = Merge(CommonConfig, {
  mode: 'production',
  entry: [require.resolve('../app/renderer/index')],
  output: {
    path: path.join(__dirname, '..', 'app/renderer/dist'),
    publicPath: './dist/',
    filename: 'renderer.prod.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
});
