import React from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import TosContent from 'components/TosContent';
import { Button, PageHeading, Scrollable } from 'components';
import withContainer from './container';

const Note = styled.div`
  font-size: 1rem;
  margin: 1.5rem 0 1.5rem;
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
            <Scrollable>
              <TosContent />
              <div ref={this.scrollObserver} />
            </Scrollable>
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
