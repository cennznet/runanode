import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader';
import { LocalizeProvider } from 'react-localize-redux';

import AppThemeProvider from './components/AppThemeProvider';
import theme from './theme';
import AppRoutes from './routes';
import store from './store';

const globalStyles = `
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: auto;
    font-size: ${theme.fontSize};
    font-family: ${theme.fontFamily};
  }
`;

const AppWithProviders = () => (
  <Provider store={store}>
    <AppThemeProvider {...{ theme, globalStyles }}>
      <LocalizeProvider store={store}>
        <Router>
          <AppRoutes />
        </Router>
      </LocalizeProvider>
    </AppThemeProvider>
  </Provider>
);

const App = hot(module)(AppWithProviders);

export default App;
