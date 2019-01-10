import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader';
import { LocalizeProvider } from 'react-localize-redux';
import AppThemeProvider from 'components/AppThemeProvider';
import theme from 'renderer/theme';
import globalStyles from './globalStyles';

import AppRoutes from './routes';
import store from './store';

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

const App = AppWithProviders;

export default App;
