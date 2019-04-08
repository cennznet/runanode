import React from 'react';
import BN from 'bn.js';

import { PreDefinedAssetId } from 'common/types/cennznet-node.types';
import Button from 'components/Button';
import { MainContent } from 'components/layout';
import MainLayout from 'renderer/components/layout/MainLayout';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import Toaster from 'components/Toaster';
import * as colors from '../../theme/colors';
import withContainer from './dev.container';

const PageTitle = styled.div`
  color: ${colors.N0};
  font-weight: 600;
  font-size: 1.7rem;
`;

const Flex = styled.div`
  display: flex;
  margin-top: 1rem;
  & > * {
    margin-right: 1rem;
  }
`;

const DevPage = ({
  onResetLocalStorage,
  onNetworkStatusClick,
  onGetHeaderClick,
  onGetRemoteHeaderClick,
  onRestartNodeClick,
  onChainSubscribeNewHead,
  onNavToChooseNetwork,
  onWalletPaperGenerate,
  nodeSystem,
  nodeStateStore,
  onTransfer,
  onTestToaster,
  onGetValidators,
  onGetSessionLength,
  onGetIntensions,
  onStake,
  onUnStake,
  onSendNodeStatus,
  onGetEraProgress,
  onGetSessionProgress,
  onGetEraLength,
  onGetIntentionsBalances,
  onToggleGlobalModal,
  onStakeAndRestart,
  onUnStakeAndRestart,
  wallets,
}) => {
  const {
    localNode: { chain },
    name,
    version,
    health,
  } = nodeSystem;
  const networkStatusLabel = `${chain} ${version} (status:${health.message}, sync:${
    health.isSyncing
  }, peers:${health.peers}, name:${name})`;

  return (
    <MainLayout>
      <MainContent>
        <PageTitle>
          <h1>Dev Page</h1>
        </PageTitle>
        <Flex>
          <Button onClick={() => onTestToaster()}>Toaster Test and Reset App UI state</Button>
          <Button
            onClick={() =>
              onToggleGlobalModal({ isOpen: true, type: 'EXIT_APP_WHILE_STAKING_MODAL' })
            }
          >
            Global Modal
          </Button>
        </Flex>
        <Flex>
          <Button
            onClick={() =>
              onStake({
                stashAccountAddress: Object.keys(wallets[0].accounts)[0],
                wallet: wallets[0],
              })
            }
          >
            Stake
          </Button>
          <Button
            onClick={() =>
              onUnStake({
                fromAddress: Object.keys(wallets[0].accounts)[0],
                wallet: wallets[0],
              })
            }
          >
            UnStake
          </Button>
          <Button onClick={() => onSendNodeStatus({ isNodeInStaking: true })}>
            Set IpcMain staking status
          </Button>
          <Button onClick={() => onSendNodeStatus({ isNodeInStaking: false })}>
            Set IpcMain non-staking status
          </Button>
        </Flex>
        <Flex>
          <Button
            onClick={() =>
              onStakeAndRestart({
                wallet: wallets[0],
                stashAccountAddress: Object.keys(wallets[0].accounts)[0],
              })
            }
          >
            Stake and restart
          </Button>
        </Flex>
        <Flex>
          <Button onClick={onNetworkStatusClick}>Get Network Status</Button>
          <div>{networkStatusLabel}</div>
        </Flex>
        <Flex>
          <Button onClick={onGetRemoteHeaderClick}>Get RemoteHeader</Button>
        </Flex>
        <Flex>
          <Button onClick={onRestartNodeClick}>Restart node</Button>
          <div>{JSON.stringify(nodeStateStore)}</div>
        </Flex>
        <Flex>
          <Button onClick={onChainSubscribeNewHead}>start chainSubscribeNewHead</Button>
        </Flex>
        <Flex>
          <Button onClick={onNavToChooseNetwork}>Nav to ChooseNetwork</Button>
        </Flex>
        <Flex>
          <Button onClick={() => onResetLocalStorage()}>Reset Local Storage</Button>
        </Flex>
        <Flex>
          <Button
            onClick={() =>
              onWalletPaperGenerate({
                mnemonic:
                  'abcde, abcde, abcde, abcde, abcde, abcde, abcde, abcde, abcde, abcde, abcde, abcde, abcde',
                address: 'Wallet address',
                name: 'Wallet Name',
                networkName: 'Network Name',
                isMainnet: true,
              })
            }
          >
            Create Paper Wallet
          </Button>
        </Flex>
        <Flex>
          <Button
            onClick={() =>
              window.appApi.createWalletWithHDKeyRing({
                passphrase: '',
              })
            }
          >
            Create HD Wallet
          </Button>
        </Flex>
        <Flex>
          <Button
            onClick={() =>
              window.appApi.restoreWallet({
                mnemonic:
                  'dove pull aerobic reason husband electric egg ceiling castle swear tank proud',
                passphrase: '',
              })
            }
          >
            Restore HD Wallet
          </Button>
        </Flex>
        <Flex>
          <Button
            onClick={() =>
              onTransfer({
                assetId: new BN(PreDefinedAssetId.stakingToken, 10),
                fromAddress: '5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE',
                toAddress: '5F1XzAhQGNcapqm666QNU2cMUnj9DRAKB6vGXoVTkxWMLhPs',
                amount: new BN('13', 10),
                wallet: wallets[0].wallet,
              })
            }
          >
            Transfer
          </Button>
        </Flex>
        <Flex>
          <Button onClick={() => onGetValidators()}>Validators</Button>
          <Button onClick={() => onGetIntensions()}>Intensions</Button>
          <Button onClick={() => onGetIntentionsBalances()}>IntentionsBalances</Button>
        </Flex>
        <Flex>
          <Button onClick={() => onGetSessionProgress()}>Session Progress</Button>
          <Button onClick={() => onGetSessionLength()}>Session Length</Button>
          <Button onClick={() => onGetEraProgress()}>EraProgress</Button>
          <Button onClick={() => onGetEraLength()}>EraLength</Button>
        </Flex>
      </MainContent>
      <Toaster />
    </MainLayout>
  );
};
export default withContainer(DevPage);
