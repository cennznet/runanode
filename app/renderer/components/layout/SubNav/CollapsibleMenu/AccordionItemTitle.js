import React, { useState } from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import { ellipsis } from 'polished';
import defaultTheme, { colors } from 'components/defaultTheme';

const Title = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  color: ${colors.V300};
  background: 'transparent';
  border: 0;
  height: 5rem;
  padding: 0 1rem;
  user-select: none;

  &:hover {
    color: ${colors.N0};
    background: ${colors.V300};
  }
`;

Title.defaultProps = {
  theme: defaultTheme,
};

const TitleHeading = styled.div`
  font-weight: ${p => (p.isTitleHighlight ? 600 : 500)};ååå
  ${ellipsis('180px')}
`;

const TitleTail = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
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
