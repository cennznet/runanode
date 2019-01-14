import React from 'react';
import { MainContent } from 'components/layout';
import MainLayout from 'renderer/components/layout/MainLayout';
import withContainer from './container';

const WalletCreatePage = ({ subNav }) => (
  <MainLayout subNav={subNav}>
    <MainContent>.</MainContent>
  </MainLayout>
);

export default withContainer(WalletCreatePage);
