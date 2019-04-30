import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { LocalizeProvider } from 'react-localize-redux';
import AppThemeProvider from 'components/AppThemeProvider';
import { Toaster } from 'components';
import theme from 'theme';
import history from 'renderer/history';
import globalStyles from 'renderer/globalStyles';
import AppRoutes from 'renderer/routes';
import store from 'renderer/store';
import GlobalModal from './GlobalModal';

const Main = () => (
  <Provider store={store}>
    <AppThemeProvider {...{ theme, globalStyles }}>
      <LocalizeProvider store={store}>
        <ConnectedRouter {...{ history }}>
          <React.Fragment>
            <Toaster />
            <GlobalModal />
            <AppRoutes />
          </React.Fragment>
        </ConnectedRouter>
      </LocalizeProvider>
    </AppThemeProvider>
  </Provider>
);

export default Main;
