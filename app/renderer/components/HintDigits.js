import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Ellipsis from 'components/Ellipsis';
import Tooltip from 'components/Tooltip';
import { colors } from 'theme';

const Wrapper = styled.div`
  cursor: pointer;
`;

const HintDigits = ({ tooltip, children, ellipsisProps }) => {
  const id = uuid();
  return (
    <Wrapper>
      <Tooltip id={id} {...tooltip}>
        <div>{children}</div>
      </Tooltip>
      <Ellipsis {...ellipsisProps} data-for={id} data-tip>
        {children || 'Error'}
      </Ellipsis>
    </Wrapper>
  );
};

HintDigits.defaultProps = {
  tooltip: {
    place: 'bottom',
    styles: {
      minWidth: '0',
    },
  },
  ellipsisProps: {
    substrLength: 6,
  },
};

export default HintDigits;
