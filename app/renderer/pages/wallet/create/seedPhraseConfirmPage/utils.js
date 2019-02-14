import uuid from 'uuid/v4';

const shuffleArray = array => {
  let counter = array.length;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    const temp = array[counter];
    array[counter] = array[index]; // eslint-disable-line
    array[index] = temp; // eslint-disable-line
  }
  return array;
};

export const getQuizList = mnemonicString => {
  return shuffleArray(
    mnemonicString.split(' ').map((str, i) => {
      return {
        name: uuid(),
        index: i + 1,
        word: str,
      };
    })
  ).slice(0, 4);
};
