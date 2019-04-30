import React from 'react';
import styled from 'styled-components';
import { colors } from 'theme';

const Checkmark = styled.span`
  display: inline-block;
  width: 1.3rem;
  height: 1.3rem;
  transform: rotate(45deg);
`;

const Stem = styled.div`
  position: absolute;
  width: 3px;
  height: 12px;
  background: ${p => p.color};
  left: 11px;
  top: 3px;
`;

const Kick = styled.div`
  position: absolute;
  width: 5px;
  height: 3px;
  background: ${p => p.color};
  left: 7px;
  top: 12px;
`;

const Tick = ({ color }) => {
  return (
    <Checkmark>
      <Stem {...{ color }} />
      <Kick {...{ color }} />
    </Checkmark>
  );
};

Tick.defaultProps = {
  color: colors.success,
};

export default Tick;
