// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

// module.exports = {
//   plugins: [
//     // your custom plugins
//   ],
//   module: {
//     rules: [
//       {
//         test: /\.scss/,
//         use: [
//           {
//             loader: 'style-loader'
//           },
//           {
//             loader: 'css-loader',
//             options: {
//               sourceMap: true,
//               modules: true,
//               localIdentName: '[name]_[local]',
//               importLoaders: true,
//             }
//           },
//           { loader: 'sass-loader', options: { sourceMap: true } }
//         ],
//       },
//       {
//         test: /\.inline\.svg$/,
//         use: 'svg-inline-loader',
//       },
//       {
//         test: /\.(woff2?|eot|ttf|otf|png|jpe?g|gif|svg)(\?.*)?$/,
//         exclude: /\.inline\.svg$/,
//         use: {
//           loader: 'url-loader',
//           options: {
//             limit: 10000,
//           }
//         }
//       },
//       {
//         test: /\.md$/,
//         use: [
//           { loader: 'html-loader', options: { importLoaders: true } },
//           { loader: 'markdown-loader?gfm=false' },
//         ]
//       },
//     ]
//   },
//   node: {
//     fs: 'empty'
//   }
// };


const always = require('ramda/src/always');
const complement = require('ramda/src/complement');
const includes = require('ramda/src/includes');
const evolve = require('ramda/src/evolve');
const filter = require('ramda/src/filter');
const when = require('ramda/src/when');
const { createDefaultWebpackConfig } = require('@storybook/core/server');

const hotReloadDisabled = process.env.STORYBOOK_HMR_DISABLED === 'true';

module.exports = (baseConfig, configType) => when(
  always(configType !== 'PRODUCTION' && hotReloadDisabled),
  evolve({
    entry: {
      preview: filter(complement(includes('webpack-hot-middleware'))),
    },
    plugins: filter(plugin => plugin.constructor.name !== 'HotModuleReplacementPlugin'),
  }),
  createDefaultWebpackConfig(baseConfig),
);
