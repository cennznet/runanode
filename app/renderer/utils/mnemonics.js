// @flow
import { generateMnemonic } from 'renderer/utils/crypto';

type MnemonicsParams = {
  passphrase: string, // 9-word mnemonic
  scrambledInput: string, // 18-word scrambled mnemonic
};

const PAPER_WALLET_WRITTEN_WORDS_COUNT = 9;

export const generateAccountMnemonics = (): Array<string> => generateMnemonic().split(' ');

// eslint-disable-next-line
export const generateAdditionalMnemonics = (): Array<string> =>
  generateMnemonic(PAPER_WALLET_WRITTEN_WORDS_COUNT).split(' ');
