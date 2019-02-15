// @flow
import { generateMnemonic } from 'renderer/utils/crypto';
import config from 'renderer/utils/config';

type MnemonicsParams = {
  passphrase: string, // 9-word mnemonic
  scrambledInput: string, // 18-word scrambled mnemonic
};

// export const unscrambleMnemonics = (
//   { passphrase, scrambledInput }: MnemonicsParams
// ): Array<string> => (
//   unscramblePaperWalletMnemonic(passphrase, scrambledInput)
// );
//
// export const scrambleMnemonics = (
//   { passphrase, scrambledInput }: MnemonicsParams
// ): Array<string> => (
//   scramblePaperWalletMnemonic(passphrase, scrambledInput)
// );

export const generateAccountMnemonics = (): Array<string> => generateMnemonic().split(' ');

// eslint-disable-next-line
export const generateAdditionalMnemonics = (): Array<string> =>
  generateMnemonic(config.app.PAPER_WALLET_WRITTEN_WORDS_COUNT).split(' ');
