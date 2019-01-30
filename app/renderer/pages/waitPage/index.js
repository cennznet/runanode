import React from 'react';
import styled from 'styled-components';
import Spinner from 'components/Spinner';
import { Layout, LayoutWrapper, MainContent } from 'components/layout';
import withContainer from './container';

const SpinnerWrapper = styled.div`
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const WaitPage = () => {
  return (
    <Layout defaultSidebar>
      <LayoutWrapper>
        <MainContent>
          <SpinnerWrapper>
            <Spinner size="2.5rem" />
          </SpinnerWrapper>
        </MainContent>
      </LayoutWrapper>
    </Layout>
  );
};
export default withContainer(WaitPage);
