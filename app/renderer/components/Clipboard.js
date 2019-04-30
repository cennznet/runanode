import React, { useRef, useState } from 'react';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'components';
import { colors } from 'theme';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.textarea`
  overflow: hidden;
  background: transparent;
  color: ${colors.N0};
  border: 0;
  outline: none;
  box-shadow: 0;
  resize: none;
  font-size: 14px;
  min-width: 26.5rem;
  height: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin-top: 2px;
`;

const Clipboard = ({ icon, children }) => {
  const id = uuid();
  const [message, setMessage] = useState('Copy address');
  const textRef = useRef(null);

  function copyToClipboard(e) {
    textRef.current.select();
    document.execCommand('copy');
    setMessage('Copied!');
  }

  return (
    <Wrapper>
      <Text ref={textRef} value={children} onChange={() => {}} />
      <Icon
        {...icon}
        onClick={copyToClipboard}
        onMouseEnter={() => setMessage('Copy address')}
        data-for={id}
        data-tip
      />
      <Tooltip id={id}>{message}</Tooltip>
    </Wrapper>
  );
};

Clipboard.defaultProps = {
  icon: {
    color: colors.N0,
    icon: 'copy',
    size: 'sm',
  },
};

export default Clipboard;
