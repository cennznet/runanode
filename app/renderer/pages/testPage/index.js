import React from 'react';
// import * as WebSocket from 'ws';
// import WsProvider from '@polkadot/rpc-provider/ws';
import { combineLatest } from 'rxjs';
import { ApiRx, ApiPromise } from '@polkadot/api';
import { switchMap } from 'rxjs/operators';
// import { ApiPromise } from '@polkadot/api';
import WsProvider from '@polkadot/rpc-provider/ws';
import withContainer from './container';
import packageJson from '../../../../package.json';

const provider = new WsProvider('wss://cennz-infra.centrality.me:9944');

// const socket = new WebSocket('wss://cennz-infra.centrality.me:9944');

// // Connection opened
// socket.onopen= (event) => {
//   socket.send('Connected the websocket!');
// };

// socket.onmessage = (event) => {
//   console.log('Message from server ', event.data.toString());
// };

// initialise via isReady & new with specific provider
new ApiPromise(provider).isReady.then(api => {
  api.rpc.chain.subscribeNewHead(header => {
    console.log(`new block #${header}`);
  });
});
// last block timestamp
// const last = 0;

// const getApix = async() => {
//   const apo = await ApiRx.create().toPromise("wss://cennz-infra.centrality.me:9944");
//   console.log('apo',apo);
//   return apo;
// }

// getApix();

new ApiRx(provider).rpc.chain.subscribeNewHead().subscribe(header => {
  console.log(`Chain is at #${header.blockNumber}`);
});

// initialise via isReady & new with specific provider
// new ApiRx(provider)
//   .isReady
//   .pipe(
//     switchMap((api) =>
//       combineLatest([
//         api.query.timestamp.blockPeriod(),
//         api.query.timestamp.now()
//       ])
//   ))
//   .subscribe(([blockPeriod, timestamp]) => {
//     const elapsed = last
//       ? `, ${timestamp.toNumber() - last}s since last`
//       : '';

//     last = timestamp.toNumber();
//     console.log(`timestamp ${timestamp}${elapsed} (${blockPeriod}s target)`);
//   });

const TestPage = ({ text }) => {
  return (
    <div>
      {text}
      <div>{packageJson.version}</div>
    </div>
  );
};

export default withContainer(TestPage);
