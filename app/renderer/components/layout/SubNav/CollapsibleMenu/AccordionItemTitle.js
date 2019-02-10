import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import defaultTheme, { colors } from 'renderer/theme';

const Title = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  color: ${colors.textMuted};
  background-color: 'transparent';
  border: 0;
  height: 5rem;
  padding: 0 1rem;
  user-select: none;
`;

Title.defaultProps = {
  theme: defaultTheme,
};

const TitleHeading = styled.div`
  font-weight: 500;

  .react-sanfona-item-expanded & {
    font-weight: 600;
    color: ${colors.N0};
  }
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

const AccordionItemTitle = ({ title }) => {
  return (
    <Title>
      <TitleHeading>{title}</TitleHeading>
      <TitleTail>
        <div className="react-sanfona-item__chevron" />
      </TitleTail>
    </Title>
  );
};

AccordionItemTitle.propTypes = {};

export default AccordionItemTitle;
