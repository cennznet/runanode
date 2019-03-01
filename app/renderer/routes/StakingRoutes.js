import React from 'react';
import { Switch } from 'react-router-dom';
import { SubNav, SimpleMenu } from 'components/layout';
import Route from 'renderer/components/Route';
import StakingOverviewPage from 'renderer/pages/stakingOverviewPage';
import StakingStakePage from 'renderer/pages/stakingStakePage';
import StakingManagePage from 'renderer/pages/stakingManagePage';
import ROUTES from 'renderer/constants/routes';

const navItems = [
  { label: 'Overview', link: ROUTES.STAKING.OVERVIEW },
  { label: 'Stake', link: ROUTES.STAKING.STAKE },
  { label: 'Manage', link: ROUTES.STAKING.MANAGE },
];

const subNav = (
  <SubNav>
    <SimpleMenu {...{ navItems }} />
  </SubNav>
);

const SettingsRoutes = () => (
  <Switch>
    <Route
      path={ROUTES.STAKING.OVERVIEW}
      component={props => <StakingOverviewPage subNav={subNav} {...props} />}
    />
    <Route
      path={ROUTES.STAKING.STAKE}
      component={props => <StakingStakePage subNav={subNav} {...props} />}
    />
    <Route
      path={ROUTES.STAKING.MANAGE}
      component={props => <StakingManagePage subNav={subNav} {...props} />}
    />
  </Switch>
);

export default SettingsRoutes;
