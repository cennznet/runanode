const recoverySeedPhrases = Array.from(Array(12), (_, x) => ({
  index: x + 1,
  name: `recovery-seedphrase-${x}`,
}));

export { recoverySeedPhrases };
