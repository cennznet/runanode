import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from 'renderer/theme';

const ScrollWrapper = styled.div`
  width: 100%;
  height: ${p => p.styles.height};
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    pointer-events: none;
    background: ${p =>
      p.gradientBottom
        ? 'linear-gradient(180deg, rgba(4, 12, 64, 0) 0%, #040c40 100%)'
        : 'transparent'};
    width: 100%;
    height: 4em;
  }
`;

const ScrollContent = styled.div`
  max-height: ${p => `calc(100% - 16px)`};
  overflow-y: auto;
  padding: 0.5rem 0;

  &::-webkit-scrollbar {
    width: 5px;
    background-color: ${p => (p.isHovered ? colors.V800 : 'transparent')};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${p => (p.isHovered ? 'rgba(255, 255, 255, 0.4)' : 'transparent')};
    transition: background-color 1000ms linear;
    border-radius: 3px;
  }
`;

const Scrollable = ({ styles, gradientBottom, children }) => {
  const [isHovered, setHovered] = useState(false);
  return (
    <ScrollWrapper {...{ styles, gradientBottom }}>
      <ScrollContent
        {...{ styles, isHovered }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </ScrollContent>
    </ScrollWrapper>
  );
};

Scrollable.defaultProps = {
  styles: {
    height: '80vh',
  },
  gradientBottom: false,
};

export default Scrollable;
