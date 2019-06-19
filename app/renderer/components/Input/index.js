import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from 'components/defaultTheme';
import InputCore from './lib/InputCore';
import InputAddon from './lib/InputAddon';
import InputAffix from './lib/InputAffix';

const InputWrapper = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

const renderWithAffix = props => {
  const { children, prefix, suffix, valid, showValidIcon } = props;

  return (
    <InputAffix {...{ prefix, suffix, valid, showValidIcon }}>
      {children || <InputCore {...props} />}
    </InputAffix>
  );
};

class Input extends Component {
  render() {
    const { prepend, append, size } = this.props;

    return (
      <InputWrapper>
        {prepend || append ? (
          <InputAddon {...{ prepend, append, size }}>
            {renderWithAffix({ ...this.props })}
          </InputAddon>
        ) : (
          renderWithAffix({ ...this.props })
        )}
      </InputWrapper>
    );
  }
}

Input.displayName = 'Input';

Input.defaultProps = {
  append: null,
  placeholder: '',
  prefix: null,
  prepend: null,
  render: null,
  showValidIcon: false,
  size: 'md',
  suffix: null,
  themeKey: 'Input',
  themeStyle: {},
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
  /** <Input render={(props)=> <Input {...props} />} /> */
  render: PropTypes.func,
  showValidIcon: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Suffix is placed inside Input; string enum: spinner, tick */
  suffix: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
  type: PropTypes.string,
  themeKey: PropTypes.string,
  themeStyle: PropTypes.object,
  valid: PropTypes.any,
};

/** @component */
export default Input;
