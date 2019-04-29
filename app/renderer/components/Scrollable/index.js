import React, { useState } from 'react';
import styled from 'styled-components';
import theme from 'components/defaultTheme';

const defaultThemeStyle = p => {
  const { colors } = p.theme;

  return {
    background: colors.V800,
    thumbBackground: 'rgba(255, 255, 255, 0.4)',
    gradientBottomBackground: 'linear-gradient(180deg, rgba(4, 12, 64, 0) 0%, #040c40 100%)',
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const ScrollWrapper = styled.div`
  width: 100%;
  height: ${p => p.themeStyle.height};
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    pointer-events: none;
    background: ${p =>
      p.gradientBottom ? computedThemeStyle(p).gradientBottomBackground : 'transparent'};
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
    background: ${p => (p.isHovered ? computedThemeStyle(p).background : 'transparent')};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${p => (p.isHovered ? computedThemeStyle(p).thumbBackground : 'transparent')};
    transition: background 1000ms linear;
    border-radius: 3px;
  }
`;

const Scrollable = ({ themeStyle, gradientBottom, children }) => {
  const [isHovered, setHovered] = useState(false);
  return (
    <ScrollWrapper {...{ themeStyle, gradientBottom }}>
      <ScrollContent
        {...{ themeStyle, isHovered }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </ScrollContent>
    </ScrollWrapper>
  );
};

Scrollable.defaultProps = {
  gradientBottom: false,
  theme,
  themeKey: 'Scrollable',
  themeStyle: {
    height: '80vh',
  },
};

/** @component */
export default Scrollable;
