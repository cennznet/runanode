import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme, { colors } from 'renderer/theme';

const ContentWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  border: ${`1px solid ${colors.N300}`};
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

const Prepend = ({ prepend }) => <PrependWrapper>{prepend}</PrependWrapper>;

const AppendWrapper = styled(ContentWrapper)`
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const Append = ({ append }) => <AppendWrapper>{append}</AppendWrapper>;

const AddonWrapper = styled.span`
  display: flex;
  flex: 1;
  align-items: center;
`;

const InputAddon = ({ children, ...otherProps }) => {
  const { prepend, append } = otherProps;

  if (!(prepend || append)) {
    return children;
  }

  return (
    <AddonWrapper>
      {prepend && <Prepend {...{ prepend }} />}
      {children}
      {append && <Append {...{ append }} />}
    </AddonWrapper>
  );
};

InputAddon.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InputAddon;
