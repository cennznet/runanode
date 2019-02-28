import React from 'react';
import styled from 'styled-components';
import SVGInline from 'react-svg-inline';
import { environment } from 'common/environment';
import { NetworkNameMapping } from 'common/types/cennznet-node.types';
import { colors } from 'renderer/theme';
import logoImg from 'renderer/assets/img/centrality-logo.svg';
import { NETWORK_OPTIONS, getNetworkOptionPair } from 'renderer/pages/chooseNetworkPage';
import { Select } from 'components';
import SwitchNetworkWarningModal from './TopBarWarningModal';
import UploadGenesisFileModal from './UploadGenesisModal';
import withContainer from './TopBarContainer';

const { isDev } = environment;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 3rem;
  background-color: ${colors.V800};
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 3rem;
  background-color: ${colors.V800};
  flex: 1 1 auto;
`;

const NetworkSectionContainer = styled.div`
  max-width: 50%;
`;

const NetworkSectionWrapper = styled.div`
  min-width: 12rem;
`;

const InfoWrapper = styled.div`
  display: flex;
`;

const InfoValue = styled.div`
  height: 16px;
  color: ${colors.N0};
  line-height: 21px;
  text-align: right;
`;

const InfoDesc = styled.div`
  height: 16px;
  color: ${colors.textMuted};
  line-height: 21px;
  text-align: right;
`;

const DevInfo = ({ isSynced, syncPercentage, blockNum, blockSpeed, networkStatusStore }) => {
  if (!isDev) {
    return <div />;
  }
  return (
    <div>
      <div>{isSynced ? '100% ' : syncPercentage + ' '} synced</div>
      <div>(block height: {blockNum})</div>
      <div>(block speed: {blockSpeed})</div>
      <div>(node state: {networkStatusStore.state})</div>
    </div>
  );
};

const TopBar = ({
  nodeSystem,
  remoteStream,
  syncStream,
  syncRemoteStream,
  setIsOpenNetworkWarningModal,
  setSelectedNetwork,
  networkStatusStore,
  ...otherProps
}) => {
  const {
    localNode: { chain },
    name,
    version,
    isSynced,
    health,
  } = nodeSystem;
  const networkName = chain ? `${chain}` : 'Not connected';
  // const isSynced = false;

  const { blockNum: remoteBlockNum, bps: remoteBps } = syncRemoteStream;
  const { blockNum: localBlockNum, bps: localBps } = syncStream;
  const blockNum = `#${localBlockNum} / #${remoteBlockNum}`;
  const blockSpeed = `${localBps ? localBps.toFixed(2) : 0}bps / ${
    remoteBps ? remoteBps.toFixed(2) : 0
  }bps`;

  const percentage = remoteBlockNum > 0 ? ((localBlockNum / remoteBlockNum) * 100).toFixed(2) : 0;
  const syncPercentage = `${percentage}%`;

  return (
    <Wrapper>
      <SVGInline svg={logoImg} />
      <HeaderWrapper>
        <NetworkSectionContainer>
          <NetworkSectionWrapper>
            <Select
              backgroundColor={colors.V800}
              fontWeight="600"
              fontSize="16px"
              borderColor="transparent"
              value={getNetworkOptionPair(NetworkNameMapping[networkName], 'value')}
              onChange={selected => {
                setIsOpenNetworkWarningModal(true);
                setSelectedNetwork(selected);
              }}
              options={NETWORK_OPTIONS}
            />
          </NetworkSectionWrapper>
        </NetworkSectionContainer>
        <DevInfo {...{ isSynced, syncPercentage, blockNum, blockSpeed, networkStatusStore }} />
        <InfoWrapper>
          <div style={{ marginRight: '2rem' }}>
            <InfoValue>
              {localBlockNum || 0}/{remoteBlockNum || 0}({syncPercentage})
            </InfoValue>
            <InfoDesc>block height</InfoDesc>
          </div>
          <div>
            <InfoValue>{localBps? localBps.toFixed(2) : 0}</InfoValue>
            <InfoDesc>bps</InfoDesc>
          </div>
        </InfoWrapper>
      </HeaderWrapper>
      <SwitchNetworkWarningModal
        setIsOpenNetworkWarningModal={setIsOpenNetworkWarningModal}
        {...otherProps}
      />
      <UploadGenesisFileModal {...otherProps} />
    </Wrapper>
  );
};

export default withContainer(TopBar);
