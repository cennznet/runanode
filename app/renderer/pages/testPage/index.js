import React from 'react';
import styled from 'styled-components';
import cennzNodeLogo from '../../assets/img/cennznode-logo.png';
import withContainer from './container';
import packageJson from '../../../../package.json';

// typeRegistry.register({
//   AssetId: 'u32'
// });

// // Move to config.js late
// const CENNZNET_NODE_1 = 'ws://cennznet-node-1.centrality.me:9944';
// const LOCAL_NODE = 'ws://localhost:9944';

// const provider = new WsProvider(CENNZNET_NODE_1);
// const localProvider = new WsProvider(LOCAL_NODE);

// // const socket = new WebSocket('wss://cennz-infra.centrality.me:9944');

// // // Connection opened
// // socket.onopen= (event) => {
// //   socket.send('Connected the websocket!');
// // };

// // socket.onmessage = (event) => {
// //   console.log('Message from server ', event.data.toString());
// // };

// // initialise via isReady & new with specific provider
// // new ApiPromise(provider).isReady.then(api => {
// //   api.rpc.chain.subscribeNewHead(header => {
// //     console.log(`new block #${header}`);
// //   });
// // });
// // last block timestamp
// // const last = 0;

// // const getApix = async() => {
// //   const apo = await ApiRx.create().toPromise("wss://cennz-infra.centrality.me:9944");
// //   console.log('apo',apo);
// //   return apo;
// // }

// // getApix();

// new ApiRx(provider).rpc.chain.subscribeNewHead().subscribe(header => {
//   console.log(`Chain is at #${header.blockNumber}`);
// });

// new ApiRx(localProvider).rpc.chain.subscribeNewHead().subscribe(header => {
//   console.log(`local block is at #${header.blockNumber}`);
// });

// new ApiPromise(localProvider).isReady.then(api => {
//   api.rpc.chain.getBlock(res => {
//     console.log(`get block #${res}`);
//   });
// });

// // initialise via isReady & new with specific provider
// // new ApiRx(provider)
// //   .isReady
// //   .pipe(
// //     switchMap((api) =>
// //       combineLatest([
// //         api.query.timestamp.blockPeriod(),
// //         api.query.timestamp.now()
// //       ])
// //   ))
// //   .subscribe(([blockPeriod, timestamp]) => {
// //     const elapsed = last
// //       ? `, ${timestamp.toNumber() - last}s since last`
// //       : '';

// //     last = timestamp.toNumber();
// //     console.log(`timestamp ${timestamp}${elapsed} (${blockPeriod}s target)`);
// //   });

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const BrandContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 32vw;
  height: 100vh;
  background-color: #000000;
`;

const LogoContainer = styled.div`
  height: 60vh;
  margin: 5rem auto;
`;

const LogoImg = styled.img.attrs({
  src: cennzNodeLogo,
  alt: 'Cennz-node logo',
})`
  width: auto;
`;

const VersionContainer = styled.div`
  font-size: 1rem;
  text-align: center;
  color: white;
`;

const SyncNodeContainer = styled.div`
  width: 68vw;
  height: 100vh;
  background-color: #1e2022;
`;

const TextWrapper = styled.div`
  font-size: 1rem;
  color: white;
`;

const TestPage = ({ text, mainNetBestBlock, localNetBestBlock }) => {
  console.log('mainNetBestBlock', mainNetBestBlock);
  console.log('localNetBestBlock', localNetBestBlock);
  return (
    <PageContainer>
      <BrandContainer>
        <LogoContainer>
          <LogoImg />
        </LogoContainer>
        <VersionContainer>{`Version ${packageJson.version}`}</VersionContainer>
      </BrandContainer>
      <SyncNodeContainer>
        <TextWrapper>Local test net</TextWrapper>
        <TextWrapper>MianNet Best Block :{mainNetBestBlock}</TextWrapper>
        <TextWrapper>Local Node Best Block :{localNetBestBlock}</TextWrapper>
      </SyncNodeContainer>
    </PageContainer>
  );
};

export default withContainer(TestPage);
