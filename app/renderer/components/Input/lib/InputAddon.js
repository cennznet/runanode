import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import styledProps from 'styled-props';

const ContentWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${p => `1px solid ${p.computedThemeStyle.borderColor}`};
  background: ${p => p.computedThemeStyle.background};
  border-radius: 3px;
  box-sizing: border-box;
`;

ContentWrapper.defaultProps = {
  computedThemeStyle: {
    size: {
      sm: '1rem',
      md: '2rem',
      lg: '3rem',
    },
  },
  size: 'md',
};

const PrependWrapper = styled(ContentWrapper)`
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  min-width: ${p => {
    return styledProps(p.computedThemeStyle.size, 'size')(p);
  }};
  height: ${p => styledProps(p.computedThemeStyle.size, 'size')(p)};
`;

const Prepend = ({ prepend, computedThemeStyle }) => (
  <PrependWrapper {...{ computedThemeStyle }}>{prepend}</PrependWrapper>
);

const AppendWrapper = styled(ContentWrapper)`
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  min-width: ${p => {
    return styledProps(p.computedThemeStyle.size, 'size')(p);
  }};
  height: ${p => styledProps(p.computedThemeStyle.size, 'size')(p)};
`;

const Append = ({ append, computedThemeStyle }) => (
  <AppendWrapper {...{ computedThemeStyle }}>{append}</AppendWrapper>
);

const AddonWrapper = styled.span`
  display: flex;
  flex: 1;
  align-items: center;
`;

const InputAddon = ({ children, ...otherProps }) => {
  const { prepend, append, computedThemeStyle } = otherProps;

  if (!(prepend || append)) {
    return children;
  }

  return (
    <AddonWrapper>
      {prepend && <Prepend {...{ prepend, computedThemeStyle }} />}
      {children}
      {append && <Append {...{ append, computedThemeStyle }} />}
    </AddonWrapper>
  );
};

InputAddon.propTypes = {
  children: PropTypes.node.isRequired,
  computedThemeStyle: PropTypes.object.isRequired,
};

export default InputAddon;
