// @flow
// export type CennznetWallet = {
//   createdAt: string,
//   balance: number,
//   hasSpendingPassword: boolean,
//   name: string,
// };

export type CreateWalletRequest = {
  name: string,
  mnemonic: string,
  passphrase: string,
};

export type CreateMnemonicRequest = {
  num: number,
};

export type GeneratePaperRequest = {
  mnemonic: string,
  address: string,
  name: string,
  isMainnet: boolean,
  networkName: ?string,
};
