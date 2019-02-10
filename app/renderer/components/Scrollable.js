import React from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

const ScrollWrapper = styled.div`
  width: 100%;
  height: ${p => p.styles.height};
`;

const ScrollContent = styled.div`
  max-height: ${p => `calc(${p.styles.height} - 16px)`};
  overflow-y: auto;
  padding: 0.5rem 0;

  &::-webkit-scrollbar {
    width: 5px;
    background-color: ${colors.V800};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 3px;
  }
`;

const Scrollable = ({ styles, children }) => (
  <ScrollWrapper {...{ styles }}>
    <ScrollContent {...{ styles }}>{children}</ScrollContent>
  </ScrollWrapper>
);

Scrollable.defaultProps = {
  styles: {
    height: '80vh',
  },
};

export default Scrollable;
