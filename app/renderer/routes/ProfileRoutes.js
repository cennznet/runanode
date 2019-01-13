import React from 'react';
import { Switch } from 'react-router-dom';
import { SubNav } from 'components/layout';
import Route from 'renderer/components/Route';
import ProfileGeneralPage from 'renderer/pages/profileGeneralPage';
import ProfileTosPage from 'renderer/pages/profileTosPage';
import types from 'renderer/types';
import ROUTES from 'renderer/constants/routes';

const navItems = [
  { title: 'General', link: ROUTES.PROFILE.GENERAL },
  { title: 'Terms and Conditions', link: ROUTES.PROFILE.TERMS_OF_USE },
];

const ProfileRoutes = () => (
  <Switch>
    <Route
      path={ROUTES.PROFILE.GENERAL}
      onEntryAction={types.homePageLoad.triggered}
      component={props => <ProfileGeneralPage subNav={<SubNav {...{ navItems }} />} {...props} />}
    />
    <Route
      path={ROUTES.PROFILE.TERMS_OF_USE}
      onEntryAction={types.walletRestorePageLoad.triggered}
      component={props => <ProfileTosPage subNav={<SubNav {...{ navItems }} />} {...props} />}
    />
  </Switch>
);

export default ProfileRoutes;
