const path = require('path');
const webpackConfig = require('./configs/webpack.config.styleguide');

module.exports = {
  title: 'ODIN UI',
  styles: {
    StyleGuide: {
      '@global body': {
        fontFamily: 'Helvetica',
      },
    },
  },
  skipComponentsWithoutExample: true,
  ignore: [
    '**/app/renderer/components/**/lib/**/*.{js,jsx}',
    '**/app/renderer/components/Button/buttonStyles.js',
    '**/app/renderer/components/Button/defaultStyling.js',
  ],
  require: [
    path.join(__dirname, `styleguideHelpers/sass/reset.scss`),
    path.join(__dirname, `styleguideHelpers/sass/centrality-ui.scss`),
    path.join(__dirname, `styleguideHelpers/setup.js`),
  ],
  styleguideComponents: {
    Wrapper: path.join(__dirname, `styleguideHelpers/ThemeWrapper`),
  },
  sections: [
    {
      name: 'Introduction',
      content: `styleguideHelpers/docs/introduction.md`,
    },
    {
      name: 'Theming',
      content: `styleguideHelpers/docs/theming.md`,
    },
    {
      name: 'Core Components',
      components: `app/renderer/components/**/*.js`,
    },
  ],
  webpackConfig,
};
