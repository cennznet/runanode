import React from 'react';
import { Button, PageHeading, PageFooter } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import withContainer from './container';

const SeedPhrasePage = ({ onClick }) => (
  <React.Fragment>
    <PageHeading subHeading="It is essential that you write this down and store it somewhere securely, like a safe or safety deposit box. If you lose access to your wallet, this seed phrase is the only way to recover your funds. Your seed phrase will only display once.">
      Store your seed phrase offline
    </PageHeading>
    <div className="content">Seed phrase </div>
    <PageFooter>
      <StartOverLink />
      <Button onClick={onClick}>Next</Button>
    </PageFooter>
  </React.Fragment>
);

export default withContainer(SeedPhrasePage);
