import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'components';
import { colors } from 'theme';

const Wrapper = styled.div`
  margin-left: 0.5rem;

  p + p {
    margin-top: 1rem;
  }
`;

const Hint = ({ tooltip, icon, children }) => {
  const id = uuid();
  return (
    <Wrapper>
      <Tooltip id={id} {...tooltip}>
        <div>{children}</div>
      </Tooltip>
      <FontAwesomeIcon data-for={id} data-tip {...icon} />
    </Wrapper>
  );
};

Hint.defaultProps = {
  tooltip: {
    place: 'bottom',
    styles: {
      minWidth: '0',
    },
  },
  icon: {
    color: colors.N0,
    icon: 'question-circle',
    size: 'sm',
  },
};

export default Hint;
