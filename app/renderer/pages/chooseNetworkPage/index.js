import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { colors } from 'renderer/theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import Select from 'components/Select';
import Input from 'components/Input';
import Button from 'components/Button';
import withContainer from './container';

const ChooseNetworkWrapper = styled.div`
  width: 60%;
`;

const JoinNetworkTitle = styled.div`
  color: ${colors.N0};
  font-weight: 600;
  font-size: 1.7rem;
  margin: 3rem auto;
`;

const NetworkOptionWrapper = styled.div`
  margin: 1rem 0;
`;

const EnterBootNodeWrapper = styled.div`
  margin: 1rem 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const NETWORK_OPTIONS = [
  { label: 'Global test net', value: 'globalTestNet' },
  { label: 'Local test net', value: 'localTestNet' },
  { label: 'Main net', value: 'mainNet' },
];

const ChooseNetWork = ({ onJoinNetwork, selectedNetwork, setSelectedNetwork }) => (
  <Layout sidebar={<SimpleSidebar />}>
    <LayoutWrapper>
      <MainContent>
        <ChooseNetworkWrapper>
          <JoinNetworkTitle>Join network</JoinNetworkTitle>
          <div>Choose network</div>
          <NetworkOptionWrapper>
            <Select
              value={selectedNetwork}
              onChange={selected => {
                console.log('selectNetwork: ', selected.value);
                setSelectedNetwork(selected);
              }}
              backgroundColor={colors.N800}
              selectedBackgroundColor={colors.N800}
              color={colors.N0}
              options={NETWORK_OPTIONS}
            />
          </NetworkOptionWrapper>
          {selectedNetwork && selectedNetwork.value === 'localTestNet' && (
            <EnterBootNodeWrapper>
              <div>Enter boot node</div>
              <Input
                color={colors.N0}
                backgroundColor="transparent"
                focusBorderColor={colors.N0}
                placeholder="#"
                onChange={e => console.log('input', e.target.value)}
              />
            </EnterBootNodeWrapper>
          )}
          <ButtonWrapper>
            <div>
              <Button
                disabled={!selectedNetwork}
                onClick={() => onJoinNetwork(selectedNetwork.value)}
              >
                Join network
              </Button>
            </div>
          </ButtonWrapper>
        </ChooseNetworkWrapper>
      </MainContent>
    </LayoutWrapper>
  </Layout>
);

export default withContainer(ChooseNetWork);
