import React from 'react';
import R from 'ramda';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MainContent, MainLayout } from 'components/layout';
import { Clipboard, PageHeading, PageFooter, Tabs, TabPane } from 'components';
import PortfolioSection from './PortfolioSection';
import ReceiveSection from './ReceiveSection';

const Subheading = ({ account }) => {
  return (
    <div style={{ display: 'flex' }}>
      <span>Public Address: </span>
      <Clipboard>{account.address}</Clipboard>
    </div>
  );
};

const AccountDetails = ({ account }) => {
  return (
    <React.Fragment>
      <PageHeading subHeading={<Subheading {...{ account }} />}>Account name here...</PageHeading>
      <div className="content">
        <Tabs defaultActiveKey="2" styles={{ maxHeight: '730px' }}>
          <TabPane tab="Portfolio" key="1">
            <PortfolioSection {...{ account }} />
          </TabPane>
          <TabPane tab="Receive" key="2">
            <ReceiveSection {...{ account }} />
          </TabPane>
        </Tabs>
      </div>
      <PageFooter blank />
    </React.Fragment>
  );
};

export default AccountDetails;
