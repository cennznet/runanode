import { shell } from 'electron';
import React, { useRef, useState } from 'react';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import R from 'ramda';

import { Tooltip } from 'components';
import { colors } from 'theme';
import { Logger } from 'renderer/utils/logging';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${p => p.styles.backgroundColor};
  padding: ${p => p.styles.padding};
`;

const Text = styled.textarea`
  overflow: hidden;
  background: transparent;
  color: ${colors.text};
  border: 0;
  outline: none;
  box-shadow: 0;
  resize: none;
  font-size: 14px;
  min-width: 26.5rem;
  height: ${p => p.styles.height};
  line-height: ${p => p.styles.lineHeight};
  text-decoration: ${p => p.styles.textDecoration};
  width: 100%;
  min-width: ${p => p.styles.textMinWidth};
  padding-top: ${p => p.styles.textPaddingTop};

  &:hover {
    text-decoration: ${p => p.styles.textDecoration};
  }
`;

const Icon = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin-top: 2px;
`;

const defaultStyling = () => {
  return {
    backgroundColor: colors.V900,
    padding: '0.5rem',
    height: '3rem',
    lineHeight: '1.2rem',
    textDecoration: 'underline',
    icon2MarginLeft: '2rem',
    textMinWidth: '20vw',
    textPaddingTop: '1.5rem',
  };
};

const ClipboardShareLinks = ({ icon, iconExtLink, children, url, styles: customStyles }) => {
  const id = uuid();
  const [message, setMessage] = useState('Copy address');
  const textRef = useRef(null);
  const styles = R.merge(defaultStyling(), customStyles);

  function copyToClipboard(e) {
    textRef.current.select();
    document.execCommand('copy');
    setMessage('Copied!');
  }

  function openExternalLink(e) {
    Logger.debug(`openExternalLink: ${textRef.current.value}`);
    shell.openExternal(url + '/' + textRef.current.value);
  }

  return (
    <Wrapper {...{ styles }}>
      <Text ref={textRef} value={children} onChange={() => {}} {...{ styles }} />
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
        onMouseEnter={() => setMessage('Check on CENNZScan')}
        data-for={id}
        data-tip
        style={{ marginLeft: styles.icon2MarginLeft }}
      />
      <Tooltip id={id}>{message}</Tooltip>
    </Wrapper>
  );
};

ClipboardShareLinks.defaultProps = {
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

export default ClipboardShareLinks;
