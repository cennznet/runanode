import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme, { colors } from 'renderer/theme';

const ContentWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
  height: 3rem;
  border: ${p => `1px solid ${p.styles.borderColor}`};
  background-color: ${p => p.styles.backgroundColor};
  border-radius: 0.2rem;
  box-sizing: border-box;
`;

ContentWrapper.defaultProps = {
  theme,
};

const PrependWrapper = styled(ContentWrapper)`
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;

const Prepend = ({ prepend, styles }) => <PrependWrapper {...{ styles }}>{prepend}</PrependWrapper>;

const AppendWrapper = styled(ContentWrapper)`
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const Append = ({ append, styles }) => <AppendWrapper {...{ styles }}>{append}</AppendWrapper>;

const AddonWrapper = styled.span`
  display: flex;
  flex: 1;
  align-items: center;
`;

const InputAddon = ({ children, ...otherProps }) => {
  const { prepend, append, styles } = otherProps;

  if (!(prepend || append)) {
    return children;
  }

  return (
    <AddonWrapper>
      {prepend && <Prepend {...{ prepend, styles }} />}
      {children}
      {append && <Append {...{ append, styles }} />}
    </AddonWrapper>
  );
};

InputAddon.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InputAddon;
