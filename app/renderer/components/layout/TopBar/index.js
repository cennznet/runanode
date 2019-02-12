import React from 'react';
import styled from 'styled-components';
import SVGInline from 'react-svg-inline';
import { colors } from 'renderer/theme';
import logoImg from 'renderer/assets/img/centrality-logo.svg';
import { NETWORK_OPTIONS, getNetworkOptionPair } from 'renderer/pages/chooseNetworkPage';
import { Select } from 'components';
import SwitchNetworkWarningModal from './TopBarWarningModal';
import UploadGenesisFileModal from './UploadGenesisModal';
import withContainer from './TopBarContainer';

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

const TopBar = ({
  nodeSystem,
  remoteStream,
  syncStream,
  syncRemoteStream,
  setIsOpenNetworkWarningModal,
  setSelectedNetwork,
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
  const blockSpeed =
    localBps && remoteBps ? `${localBps.toFixed(2)}bps / ${remoteBps.toFixed(2)}bps` : '0 bps';

  const percentage = remoteBlockNum > 0 ? ((localBlockNum / remoteBlockNum) * 100).toFixed(2) : 0;
  const syncPercentage = `${percentage}%`;

  return (
    <Wrapper>
      <SVGInline svg={logoImg} />
      <HeaderWrapper>
        <NetworkSectionContainer>
          <NetworkSectionWrapper>
            <Select
              fontWeight="600"
              fontSize="16px"
              borderColor="transparent"
              value={getNetworkOptionPair(networkName, 'label')}
              onChange={selected => {
                setIsOpenNetworkWarningModal(true);
                setSelectedNetwork(selected);
              }}
              options={NETWORK_OPTIONS}
            />
          </NetworkSectionWrapper>
        </NetworkSectionContainer>
        <div>
          <div>{isSynced ? '100% ' : syncPercentage + ' '} synced</div>
          <div>(block speed: {blockSpeed})</div>
        </div>
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
