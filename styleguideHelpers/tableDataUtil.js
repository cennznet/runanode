import namor from 'namor'; // eslint-disable-line

const range = len => new Array(len).fill(0).map((_, x) => x);

const newPerson = () => {
  const statusChance = Math.random();
  return {
    firstName: namor.generate({
      words: 1,
      numbers: 0,
    }),
    lastName: namor.generate({
      words: 1,
      numbers: 0,
    }),
    age: Math.floor(Math.random() * 30),
    balance: Math.floor(Math.random() * 1000).toFixed(2),
    progress: Math.floor(Math.random() * 100),
    status: statusChance > 0.66 ? 'relationship' : statusChance > 0.33 ? 'complicated' : 'single',
  };
};

export function makeData(len = 50) {
  return range(len).map(() => ({
    ...newPerson(),
    children: range(10).map(newPerson),
  }));
}
