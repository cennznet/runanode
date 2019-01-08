/* eslint global-require: off */

const developmentEnvironments = ['development', 'test'];

const developmentPlugins = [require('react-hot-loader/babel')];

const productionPlugins = [
  require('babel-plugin-dev-expression'),

  // babel-preset-react-optimize
  require('@babel/plugin-transform-react-constant-elements'),
  require('@babel/plugin-transform-react-inline-elements'),
  require('babel-plugin-transform-react-remove-prop-types'),
];

module.exports = api => {
  // see docs about api at https://babeljs.io/docs/en/config-files#apicache

  const development = api.env(developmentEnvironments);

  return {
    presets: [
      [
        require('@babel/preset-env'),
        {
          targets: { electron: require('electron/package.json').version },
          useBuiltIns: 'usage',
        },
      ],
      require('@babel/preset-flow'),
      [require('@babel/preset-react'), { development }],
    ],
    plugins: [
      [require('@babel/plugin-proposal-object-rest-spread'), { useBuiltIns: false }],
      require('babel-plugin-styled-components'),
      require('babel-plugin-polished'),
      [require('babel-plugin-ramda'), { useES: true }],
      [
        require('babel-plugin-module-resolver'),
        {
          root: ['./'],
          alias: {
            app: './app',
            common: './app/common',
            main: './app/main',
            renderer: './app/renderer',
            components: './app/renderer/components',
            utils: './app/renderer/utils',
          },
        },
      ],

      // Stage 3
      require('@babel/plugin-syntax-dynamic-import'),
      require('@babel/plugin-syntax-import-meta'),
      [require('@babel/plugin-proposal-class-properties'), { loose: true }],
      require('@babel/plugin-proposal-json-strings'),

      ...(development ? developmentPlugins : productionPlugins),
    ],
  };
};
