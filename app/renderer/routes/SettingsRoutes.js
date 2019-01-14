import React from 'react';
import { Switch } from 'react-router-dom';
import { SubNav } from 'components/layout';
import Route from 'renderer/components/Route';
import SettingsGeneralPage from 'renderer/pages/settingsGeneralPage';
import SettingsTosPage from 'renderer/pages/settingsTosPage';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';

const navItems = [
  { title: 'General', link: ROUTES.SETTINGS.GENERAL },
  { title: 'Terms and Conditions', link: ROUTES.SETTINGS.TERMS_OF_USE },
];

const SettingsRoutes = () => (
  <Switch>
    <Route
      path={ROUTES.SETTINGS.GENERAL}
      component={props => <SettingsGeneralPage subNav={<SubNav {...{ navItems }} />} {...props} />}
    />
    <Route
      path={ROUTES.SETTINGS.TERMS_OF_USE}
      component={props => <SettingsTosPage subNav={<SubNav {...{ navItems }} />} {...props} />}
    />
  </Switch>
);

export default SettingsRoutes;
