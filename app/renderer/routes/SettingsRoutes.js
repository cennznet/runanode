import React from 'react';
import { Switch } from 'react-router-dom';
import { SubNav, SimpleMenu } from 'components/layout';
import Route from 'renderer/components/Route';
import SettingsGeneralPage from 'renderer/pages/settingsGeneralPage';
import SettingsTosPage from 'renderer/pages/settingsTosPage';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';

const navItems = [
  { label: 'General', link: ROUTES.SETTINGS.GENERAL },
  { label: 'Terms and Conditions', link: ROUTES.SETTINGS.TERMS_OF_USE },
];

const subNav = (
  <SubNav>
    <SimpleMenu {...{ navItems }} />
  </SubNav>
);

const SettingsRoutes = () => (
  <Switch>
    <Route
      path={ROUTES.SETTINGS.GENERAL}
      component={props => <SettingsGeneralPage subNav={subNav} {...props} />}
    />
    <Route
      path={ROUTES.SETTINGS.TERMS_OF_USE}
      component={props => <SettingsTosPage subNav={subNav} {...props} />}
    />
  </Switch>
);

export default SettingsRoutes;
