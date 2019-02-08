import React, { Fragment } from 'react';
import styled from 'styled-components';
import theme from 'renderer/theme';

const ChevronUp = styled.div`
  border: 1px solid ${p => p.theme.colors.N700};
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-135deg);
`;

ChevronUp.defaultProps = {
  theme,
};

const ChevronDown = styled.div`
  border: 1px solid ${p => p.theme.colors.N700};
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
`;

ChevronUp.defaultProps = {
  theme,
};

const Expander = ({ isExpanded }) => (
  <Fragment>{isExpanded ? <ChevronUp theme={theme} /> : <ChevronDown theme={theme} />}</Fragment>
);

const tableExpander = () => ({
  Header: null,
  expander: true,
  width: 50,
  Expander,
  style: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default tableExpander;
