import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import styledProps from 'styled-props';
import defaultThemeStyle from './defaultThemeStyle';

const computedThemeStyle = p => p.theme.utils.createThemeStyle(p, defaultThemeStyle);

const ContentWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${p => `1px solid ${computedThemeStyle(p).borderColor}`};
  background: ${p => computedThemeStyle(p).background};
  border-radius: ${p => p.theme.borderRadius};
  box-sizing: border-box;
`;

ContentWrapper.defaultProps = {
  themeKey: 'Input',
};

const PrependWrapper = styled(ContentWrapper)`
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  min-width: ${p => styledProps(computedThemeStyle(p), 'size')(p)[p.size]};
  height: ${p => styledProps(computedThemeStyle(p), 'size')(p)[p.size]};
`;

const Prepend = ({ prepend, size }) => <PrependWrapper {...{ size }}>{prepend}</PrependWrapper>;

const AppendWrapper = styled(ContentWrapper)`
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  min-width: ${p => styledProps(computedThemeStyle(p), 'size')(p)[p.size]};
  height: ${p => styledProps(computedThemeStyle(p), 'size')(p)[p.size]};
`;

const Append = ({ append, size }) => <AppendWrapper {...{ size }}>{append}</AppendWrapper>;

const AddonWrapper = styled.span`
  display: flex;
  flex: 1;
  align-items: center;
`;

const InputAddon = ({ children, ...otherProps }) => {
  const { prepend, append, size } = otherProps;

  if (!(prepend || append)) {
    return children;
  }

  return (
    <AddonWrapper>
      {prepend && <Prepend {...{ prepend, size }} />}
      {children}
      {append && <Append {...{ append, size }} />}
    </AddonWrapper>
  );
};

InputAddon.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InputAddon;
