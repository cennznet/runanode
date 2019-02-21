import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme, { colors } from 'renderer/theme';
import InputCore from './lib/InputCore';
import InputAddon from './lib/InputAddon';
import InputAffix from './lib/InputAffix';

const InputWrapper = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

const renderWithAffix = props => {
  const { children, prefix, suffix, valid } = props;

  return (
    <InputAffix {...{ prefix, suffix, valid }}>{children || <InputCore {...props} />}</InputAffix>
  );
};

class CustomInput extends Component {
  render() {
    const { prepend, append, styles } = this.props;
    return (
      <InputWrapper>
        {prepend || append ? (
          <InputAddon {...{ prepend, append, styles }}>{renderWithAffix(this.props)}</InputAddon>
        ) : (
          renderWithAffix(this.props)
        )}
      </InputWrapper>
    );
  }
}

const Input = styled(CustomInput)``;

Input.defaultProps = {
  theme,
  styles: {
    borderColor: colors.V400,
    backgroundColor: 'rgba(114,94,255,0.5)',
    color: colors.N0,
    focusBorderColor: colors.V500,
  },
  type: 'text',
  placeholder: '',
  valid: null,
  render: null,
  prepend: null,
  append: null,
  prefix: null,
  suffix: null,
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  /** <Input render={(props)=> <CustomInput {...props} />} /> */
  render: PropTypes.func,
  /** Prepend addon which is placed outside Input */
  prepend: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
  /** Append addon which is placed outside Input */
  append: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
  /** Prefix is placed inside Input */
  prefix: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
  /** Suffix is placed inside Input; string enum: spinner, tick */
  suffix: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
};

export default Input;
