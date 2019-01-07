import React from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import Select from 'components/Select';

const JoinNetworkTitle = styled.div`
  color: ${colors.N0};
  font-weight: 600;
  font-size: 1.7rem;
  margin: 3rem auto;
`;

const ChooseNetworkWrapper = styled.div``;

const NetworkOptionWrapper = styled.div`
  width: 60%;
  margin: 1rem 0;
`;

const EnterBootNodeWrapper = styled.div``;

const NETWORK_OPTIONS = [
  { label: 'Global test net', value: 'globalTestNet' },
  { label: 'Local test net', value: 'localTestNet' },
  { label: 'Main net', value: 'mainNet' },
];

export default class ChooseNetWork extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedNetwork: null };
  }

  render() {
    const { selectedNetwork } = this.state;
    return (
      <Layout sidebar={<SimpleSidebar />}>
        <LayoutWrapper>
          <MainContent>
            <JoinNetworkTitle>Join network</JoinNetworkTitle>
            <ChooseNetworkWrapper>
              <div>Choose network</div>
              <NetworkOptionWrapper>
                <Select
                  value={selectedNetwork}
                  onChange={selected => {
                    console.log('selectNetwork: ', selected.value);
                    this.setState({ selectedNetwork: selected });
                  }}
                  backgroundColor={colors.N800}
                  selectedBackgroundColor={colors.N800}
                  color={colors.N0}
                  options={NETWORK_OPTIONS}
                />
              </NetworkOptionWrapper>
            </ChooseNetworkWrapper>
            <EnterBootNodeWrapper>
              <div>Enter boot node</div>
            </EnterBootNodeWrapper>
          </MainContent>
        </LayoutWrapper>
      </Layout>
    );
  }
}
