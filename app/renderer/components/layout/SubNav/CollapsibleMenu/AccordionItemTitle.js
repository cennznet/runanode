import React, { useState } from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import { ellipsis } from 'polished';
import themeObject from 'theme';

const defaultThemeStyle = p => {
  const { colors } = p.theme;
  return {
    fontSize: '14px',
    color: colors.textMuted,
    hoverBackground: colors.primary,
    hoverColor: colors.N0,
    activeColor: colors.N0,
  };
};

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const Title = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  color: ${p => computedThemeStyle(p).color};
  background: 'transparent';
  border: 0;
  height: 5rem;
  padding: 0 1rem;
  user-select: none;

  &:hover {
    background: ${p => computedThemeStyle(p).hoverBackground};
    color: ${p => computedThemeStyle(p).hoverColor};
  }
`;

Title.defaultProps = {
  themeKey: 'AppSubNavCollapsibleMenuTitle',
};

const TitleHeading = styled.div`
  font-size: ${p => computedThemeStyle(p).fontSize};
  font-weight: ${p => (p.isTitleHighlight ? 600 : 500)};
  color: ${p =>
    p.isTitleHighlight ? computedThemeStyle(p).activeColor : computedThemeStyle(p).color};
  ${ellipsis('180px')};

  ${Title}:hover & {
    color: ${p => computedThemeStyle(p).hoverColor};
  }
`;

TitleHeading.defaultProps = {
  themeKey: 'AppSubNavCollapsibleMenuTitle',
};

const TitleTail = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const defaultTail = <div className="react-sanfona-item__chevron" />;

const AccordionItemTitle = ({ title, isTitleHighlight, tail }) => {
  const [isHovered, setHovered] = useState(false);
  return (
    <Title onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <TitleHeading {...{ title, isTitleHighlight }}>{title}</TitleHeading>
      <TitleTail>{isHovered ? defaultTail : tail || defaultTail}</TitleTail>
    </Title>
  );
};

AccordionItemTitle.defaultProps = {
  isTitleHighlight: false,
};

export default AccordionItemTitle;
