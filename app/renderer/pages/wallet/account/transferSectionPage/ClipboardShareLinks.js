import { shell } from 'electron';
import React, { useRef, useState } from 'react';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'components';
import { colors } from 'renderer/theme';
import { Logger } from 'renderer/utils/logging';


const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colors.V900};
  padding: 0.5rem;
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
  height: 3rem;
  line-height: 3rem;
  text-decoration: underline;
  width: 100%;

  &:hover {
    text-decoration: underline;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin-top: 2px;
`;

const Clipboard = ({ icon, iconExtLink, children, url }) => {
  const id = uuid();
  const [message, setMessage] = useState('Copy address');
  const textRef = useRef(null);

  function copyToClipboard(e) {
    textRef.current.select();
    document.execCommand('copy');
    setMessage('Copied!');
  }

  function openExternalLink(e) {
    Logger.debug(`openExternalLink: ${textRef.current.value}`);
    shell.openExternal(url+'/'+textRef.current.value);
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
      <Icon
        {...iconExtLink}
        onClick={openExternalLink}
        onMouseEnter={() => setMessage('Open external link')}
        data-for={id}
        data-tip
        style={{marginLeft: '2rem'}}
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
  iconExtLink: {
    color: colors.N0,
    icon: 'external-link-alt',
    size: 'sm',
  },
};

export default Clipboard;
