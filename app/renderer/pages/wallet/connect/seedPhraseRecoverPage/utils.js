const seedPhraseFields = Array.from(Array(12), (_, x) => ({
  index: x + 1,
  name: `seedphrase-${x}`,
}));

export { seedPhraseFields };
