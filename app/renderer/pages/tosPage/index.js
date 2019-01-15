import React from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import TosContent from 'components/TosContent';
import { Button, PageHeading } from 'components';
import withContainer from './container';

const ScrollWrapper = styled.div`
  width: 100%;
  height: 80vh;
`;

const ScrollContent = styled.div`
  margin-top: 0.5rem;
  max-height: calc(80vh - 40px);
  overflow-y: auto;
  padding: 0.5rem 0;

  &::-webkit-scrollbar {
    width: 5px;
    background-color: ${colors.N900};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${colors.N700};
    border-radius: 3px;
  }
`;

const Note = styled.div`
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

class TosPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { locked: true };
    this.observe = null;
  }

  scrollObserver = ref => {
    if (ref) {
      new IntersectionObserver(
        (entries, observer) => {
          const locked = !entries.some(({ intersectionRatio }) => intersectionRatio > 0.9);
          if (!locked) {
            this.setState({ locked });
            observer.disconnect();
          }
        },
        { threshold: 1.0 }
      ).observe(ref);
    }
  };

  render() {
    const { onAcceptTermsOfUse } = this.props;
    return (
      <Layout sidebar={<SimpleSidebar />}>
        <LayoutWrapper>
          <MainContent>
            <ScrollWrapper>
              <ScrollContent>
                <PageHeading>Terms & Conditions</PageHeading>
                <TosContent />
                <div ref={this.scrollObserver} />
              </ScrollContent>
            </ScrollWrapper>
            <Note>By clicking I Agree, you agree to our terms and conditions</Note>
            <Button disabled={this.state.locked} onClick={() => onAcceptTermsOfUse()}>
              I Agree
            </Button>
          </MainContent>
        </LayoutWrapper>
      </Layout>
    );
  }
}

export default withContainer(TosPage);
