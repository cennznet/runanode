const seedPhraseFields = Array.from(Array(12), (_, x) => ({
  index: x + 1,
  name: `recovery-seedPhrase-${x}`,
}));

export { seedPhraseFields };
