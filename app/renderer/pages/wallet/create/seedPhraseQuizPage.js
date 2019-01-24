import React from 'react';
import { Link } from 'react-router-dom';
import { Button, PageHeading, PageFooter } from 'components';
import StartOverLink from 'renderer/pages/wallet/StartOverLink';
import ROUTES from 'renderer/constants/routes';
import withContainer from './container';

const SeedPhraseQuizPage = ({ moveToStep }) => (
  <React.Fragment>
    <PageHeading subHeading="">Seed phrase quiz</PageHeading>
    <div className="content">Seed phrase quiz</div>
    <PageFooter>
      <StartOverLink />
      <Link to={ROUTES.WALLET.LIST}>Next</Link>
    </PageFooter>
  </React.Fragment>
);

export default withContainer(SeedPhraseQuizPage);
