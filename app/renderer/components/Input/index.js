import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from 'components/defaultTheme';
import InputCore from './lib/InputCore';
import InputAddon from './lib/InputAddon';
import InputAffix from './lib/InputAffix';

const defaultThemeStyle = p => {
  return {
    borderColor: p.theme.colors.V400,
    background: 'rgba(114,94,255,0.5)',
    readOnlyBackground: 'rgba(114,94,255,0.3)',
    readOnlyBorderColor: 'rgba(114,94,255,0.3)',
    color: p.theme.colors.N0,
    focusBorderColor: p.theme.colors.V500,
    placeholderColor: p.theme.colors.V400,
    size: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
  };
};

const InputWrapper = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

const renderWithAffix = props => {
  const { children, prefix, suffix, valid, showValidIcon, computedThemeStyle } = props;

  return (
    <InputAffix {...{ prefix, suffix, valid, showValidIcon, computedThemeStyle }}>
      {children || <InputCore {...props} />}
    </InputAffix>
  );
};

class CustomInput extends Component {
  render() {
    const { prepend, append } = this.props;
    const computedThemeStyle = this.props.theme.utils.createThemeStyle(
      this.props,
      defaultThemeStyle
    );

    return (
      <InputWrapper>
        {prepend || append ? (
          <InputAddon {...{ prepend, append, computedThemeStyle }}>
            {renderWithAffix({ computedThemeStyle, ...this.props })}
          </InputAddon>
        ) : (
          renderWithAffix({ computedThemeStyle, ...this.props })
        )}
      </InputWrapper>
    );
  }
}

const Input = styled(CustomInput)``;

Input.defaultProps = {
  append: null,
  placeholder: '',
  prefix: null,
  prepend: null,
  render: null,
  showValidIcon: false,
  size: 'md',
  suffix: null,
  theme,
  themeKey: 'Input',
  type: 'text',
  valid: null,
};

Input.propTypes = {
  /** Append addon which is placed outside Input */
  append: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
  /** Prepend addon which is placed outside Input */
  placeholder: PropTypes.string,
  /** Prefix is placed inside Input */
  prefix: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
  prepend: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
  /** <Input render={(props)=> <CustomInput {...props} />} /> */
  render: PropTypes.func,
  showValidIcon: PropTypes.bool,
  /** Suffix is placed inside Input; string enum: spinner, tick */
  suffix: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
  type: PropTypes.string,
};

/** @component */
export default Input;
