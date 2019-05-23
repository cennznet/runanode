import React from 'react';
import styled from 'styled-components';
import Spinner from 'components/Spinner';
import { Layout, LayoutWrapper, MainContent } from 'components/layout';
import SimpleSidebar from 'components/layout/SimpleSidebar'; // have to import like this to fix this issue: https://stackoverflow.com/questions/50428339/error-minified-react-error-130
import withContainer from './container';

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const ExitingPage = ({ nodeStateStore }) => {
  return (
    <Layout sidebar={<SimpleSidebar />}>
      <LayoutWrapper>
        <MainContent>
          <SpinnerWrapper>
            <Spinner size="xl" />
            {nodeStateStore.state}...
          </SpinnerWrapper>
        </MainContent>
      </LayoutWrapper>
    </Layout>
  );
};
export default withContainer(ExitingPage);
