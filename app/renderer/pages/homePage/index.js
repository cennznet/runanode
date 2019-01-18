import React from 'react';
import Button from 'components/Button';
import styled from 'styled-components';
import Spinner from 'components/Spinner';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import withContainer from './container';

const HomePage = () => {
  return (
    // <Layout sidebar={<SimpleSidebar />}>
    <Layout defaultSidebar>
      <LayoutWrapper>
        <MainContent>
          <Spinner />
        </MainContent>
      </LayoutWrapper>
    </Layout>
  );
};
export default withContainer(HomePage);
