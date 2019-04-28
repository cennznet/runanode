const path = require('path');
const webpackConfig = require('./configs/webpack.config.styleguide');

module.exports = {
  title: 'rUN UI',
  theme: {
    color: {
      link: '#FFFFFF',
      linkHover: '#CCCCCC',

      codeBracket: '#e2777a',
      codeComment: '#DDDDDD',
      codeDeleted: '#f8c555',
      codeFunction: '#f08d49',
      codeInserted: '#690',
      codeKeyword: '#cc99cd',
      codeOperator: '#67cdcc',
      codeProperty: '#f8c555',
      codePunctuation: '#DDDDDD',
      codeString: '#690',
      codeTag: '#e2777a',
      codeVariable: '#7ec699',
    },
  },
  styles: {
    Editor: {
      root: {
        background: '#040C40',
        color: '#FFFFFF !important',
        lineHeight: '1.25rem',
        fontSize: '14px',
      },
    },
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
    Table: {
      cell: {
        background: '#FFFFFF',
      },
      cellHeading: {
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
    Pre: {
      pre: {
        background: '#040C40',
        color: '#FFFFFF !important',
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
    '**/app/renderer/components/Button/defaultThemeStyle.js',
    '**/app/renderer/components/Table/tableExpander.js',
    '**/app/renderer/components/Tabs/TabPane.js',
    '**/app/renderer/components/Modal/ModalBody.js',
    '**/app/renderer/components/Modal/ModalFooter.js',
    '**/app/renderer/components/cssIcons/index.js',
    '**/app/renderer/components/Toaster/toast.js',
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
      name: 'Colors',
      content: `styleguideHelpers/docs/colors.md`,
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
