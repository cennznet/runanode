import React from 'react';
import { MainContent } from 'components/layout';
import Button from 'components/Button';
import MainLayout from 'renderer/components/layout/MainLayout';
import withContainer from './container';

const WalletRestorePage = ({ subNav, onReset }) => (
  <MainLayout subNav={subNav}>
    <MainContent>
      <Button onClick={() => onReset()}>Reset ToS</Button>
    </MainContent>
  </MainLayout>
);

export default withContainer(WalletRestorePage);
