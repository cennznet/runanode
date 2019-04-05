import React from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';

import * as animationData from 'renderer/assets/lottie/error.json';
import { colors } from 'renderer/theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import { Button, PageHeading, Scrollable } from 'components';
import MainLayout from 'renderer/components/layout/MainLayout';
import withContainer from './container';


const Note = styled.div`
  font-size: 1rem;
  margin: 1.5rem 0 1.5rem;
`;

const FlexContainer = styled.div`
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 80px);
`;

const Row = styled.div`
    width: auto;
`;

const FlexItem = styled.div`
    text-align: center;
`;

class TosPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { locked: true };
    this.observe = null;
  }

  render() {
    const { onAcceptTermsOfUse } = this.props;

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    return (
      <MainLayout withoutSidebar>
        <MainContent>
          <FlexContainer>
            <Row>
              <Lottie
                options={defaultOptions}
                height={200}
                width={200}
                isStopped={false}
                isPaused={false}/>
              <FlexItem>
                <PageHeading>Oops, something went wrong</PageHeading>
              </FlexItem>
              <FlexItem>
                <Note>
                  Try restart the application again, or feel free
                  to <a href='mailto:support@runanode.io' style={{color: colors.N0}}>contract us</a> if
                  the problem persists
                </Note>
              </FlexItem>
            </Row>
          </FlexContainer>
        </MainContent>
      </MainLayout>
    );
  }
}

export default withContainer(TosPage);
