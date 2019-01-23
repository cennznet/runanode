import React from 'react';
import { Button, PageHeading, PageFooter } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import withContainer from './container';

const NameInputPage = ({ step, moveToStep, onClick }) => {
  return (
    <React.Fragment>
      <PageHeading subHeading="">Name your wallet</PageHeading>
      <div className="content">Wallet name input</div>
      <PageFooter>
        <StartOverLink />
        <Button onClick={onClick}>Next</Button>
      </PageFooter>
    </React.Fragment>
  );
};

export default withContainer(NameInputPage);
