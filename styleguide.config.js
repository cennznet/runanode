const path = require('path');
const webpackConfig = require('./configs/webpack.config.styleguide');

module.exports = {
  title: 'ODIN UI',
  theme: {
    color: {
      link: '#FFFFFF',
      linkHover: '#CCCCCC',
    },
  },
  styles: {
    Heading: {
      heading: {
        color: '#FFFFFF',
      },
    },
    Logo: {
      logo: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
    },
    StyleGuide: {
      '@global body': {
        color: '#FFFFFF',
        fontFamily: 'Helvetica',
        fontSize: '14px',
      },
      root: {
        background: 'linear-gradient(180deg, #1335B6 0%, #040C40 100%)',
        color: '#FFFFFF',
      },
      sidebar: {
        background: 'linear-gradient(180deg, #1335B6 0%, #040C40 100%)',
        border: 0,
      },
    },
    Pathline: {
      pathline: {
        color: '#FFFFFF',
      },
    },
    TabButton: {
      button: {
        color: '#FFFFFF',
      },
    },
    TableOfContents: {
      input: {
        backgroundColor: 'transparent',
      },
    },
    Playground: {
      preview: {
        border: '1px solid #1130FF',
      },
    },
  },
  compilerConfig: {
    transforms: { templateString: false },
  },
  skipComponentsWithoutExample: true,
  ignore: [
    '**/app/renderer/components/**/lib/**/*.{js,jsx}',
    '**/app/renderer/components/Button/buttonStyles.js',
    '**/app/renderer/components/Button/defaultStyling.js',
    '**/app/renderer/components/Table/tableExpander.js',
    '**/app/renderer/components/Tabs/TabPane.js',
    '**/app/renderer/components/layout/SubNav/CollapsibleMenu/*.js',
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
