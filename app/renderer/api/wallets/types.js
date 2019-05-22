// @flow

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

export type GetWalletAddressRequest = {
  accountKeyringMap: object,
};

export type AddAccountRequest = {
  wallet: object,
};
