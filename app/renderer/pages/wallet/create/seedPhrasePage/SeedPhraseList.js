import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import MNEMONIC_RULE from 'renderer/constants/mnemonic';

import { colors } from 'theme';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 50rem;
`;

const Index = styled.div`
  margin-right: 0.5rem;
  color: ${colors.textMuted};
`;

const WordWrapper = styled.div`
  display: flex;
  font-size: 1rem;
  width: 10rem;
  height: 4rem;
`;

const Word = ({ index, children }) => {
  return (
    <WordWrapper>
      <Index>{index}</Index>
      <span>{children}</span>
    </WordWrapper>
  );
};

const SeedPhraseList = ({ mnemonicString }) => (
  <Wrapper>
    {mnemonicString.split(MNEMONIC_RULE).map((word, i) => (
      <Word key={uuid()} index={i + 1}>
        {word}
      </Word>
    ))}
  </Wrapper>
);

export default SeedPhraseList;
