import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import themeObj from 'renderer/theme';
import InputCore from './lib/InputCore';
import InputAddon from './lib/InputAddon';
import InputAffix from './lib/InputAffix';

const InputWrapper = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

class CustomInput extends Component {
  renderWithAffix = props => {
    const { children, prefix, suffix } = props;

    return (
      <Fragment>
        {prefix || suffix ? (
          <InputAffix {...{ prefix, suffix }}>{children || <InputCore {...props} />}</InputAffix>
        ) : (
          <Fragment>{children || <InputCore {...props} />}</Fragment>
        )}
      </Fragment>
    );
  };

  render() {
    const { prepend, append } = this.props;
    return (
      <InputWrapper>
        {prepend || append ? (
          <InputAddon {...{ prepend, append }}> {this.renderWithAffix(this.props)}</InputAddon>
        ) : (
          this.renderWithAffix(this.props)
        )}
      </InputWrapper>
    );
  }
}

const Input = styled(CustomInput)``;

Input.defaultProps = {
  theme: themeObj,
  render: null,
  prepend: null,
  append: null,
  prefix: null,
  suffix: null,
};

Input.propTypes = {
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
