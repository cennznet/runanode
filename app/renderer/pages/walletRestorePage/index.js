import React from 'react';
import { MainContent } from 'components/layout';
import Button from 'components/Button';
import MainLayout from 'renderer/components/layout/MainLayout';
import withContainer from './container';

const WalletRestorePage = ({ subNav, onResetTermsOfUse }) => (
  <MainLayout subNav={subNav}>
    <MainContent>
      <Button onClick={() => onResetTermsOfUse()}>Reset ToS</Button>
    </MainContent>
  </MainLayout>
);

export default withContainer(WalletRestorePage);
