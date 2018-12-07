import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader';
import { LocalizeProvider } from 'react-localize-redux';

import AppThemeProvier from '@/components/AppThemeProvider';
import AppRoutes from './routes';
import store from './store';

const globalStyles = `
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: auto;
    font-size: 14px;
  }
`;

const AppWithProviders = () => (
  <Provider store={store}>
    <AppThemeProvier theme={{}} {...{ globalStyles }}>
      <LocalizeProvider store={store}>
        <Router>
          <AppRoutes />
        </Router>
      </LocalizeProvider>
    </AppThemeProvier>
  </Provider>
);

const App = hot(module)(AppWithProviders);

export default App;
