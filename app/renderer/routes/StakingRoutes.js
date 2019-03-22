import React from 'react';
import { Switch } from 'react-router-dom';
import { SubNav, SimpleMenu } from 'components/layout';
import Route from 'renderer/components/Route';
import StakingOverviewPage from 'renderer/pages/stakingOverviewPage';
import StakingStakePage from 'renderer/pages/stakingStakePage';
import StakingManagePage from 'renderer/pages/stakingManagePage';
import ROUTES from 'renderer/constants/routes';

const getNavItems = (isStakingStated) => {
  const navItems = [
    { label: 'Overview', link: ROUTES.STAKING.OVERVIEW }
    ];

  if(isStakingStated) {
    navItems.push({ label: 'Manage', link: ROUTES.STAKING.MANAGE });
  } else {
    navItems.push({ label: 'Start to stake', link: ROUTES.STAKING.STAKE });
  }
  return navItems;
};

const subNav = (isStakingStated) => {
  const navItems = getNavItems(isStakingStated);
  return (
    <SubNav>
      <SimpleMenu {...{ navItems }} />
    </SubNav>
  );
};

const StakingRoutes = ({ isStakingStated }) => (
  <Switch>
    <Route
      path={ROUTES.STAKING.OVERVIEW}
      component={props => <StakingOverviewPage subNav={subNav(isStakingStated)} {...props} />}
    />
    <Route
      path={ROUTES.STAKING.STAKE}
      component={props => <StakingStakePage subNav={subNav(isStakingStated)} {...props} />}
    />
    <Route
      path={ROUTES.STAKING.MANAGE}
      component={props => <StakingManagePage subNav={subNav(isStakingStated)} {...props} />}
    />
  </Switch>
);

export default StakingRoutes;
