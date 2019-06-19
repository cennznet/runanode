import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import styledProps from 'styled-props';
import Spinner from 'components/Spinner';
import defaultThemeStyle from './defaultThemeStyle';
import buttonStyles from './buttonStyles';

const StyledButton = styled.button`
  ${p => buttonStyles(p)};
  margin-right: ${p => (p.inputSuffix ? '0.25rem' : '')};
  min-width: ${p => p.minWidth};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
`;

const ButtonSpinner = styled(Spinner).attrs(p => {
  return {
    color: styledProps(defaultThemeStyle({ theme: p.theme }).contrastColor, 'variant')({
      variant: p.variant,
    }),
  };
})``;

const IconAfter = ({ iconAfter, loading, variant }) => {
  const icon = loading ? <ButtonSpinner size="sm" variant={variant} /> : iconAfter;

  return <IconWrapper>{icon}</IconWrapper>;
};

const Button = ({ children, iconBefore, iconAfter, variant, loading, ...restProps }) => (
  <StyledButton {...restProps} {...{ iconBefore, iconAfter, loading, variant }}>
    {iconBefore && <IconWrapper>{iconBefore}</IconWrapper>}
    {children}
    {(iconAfter || loading) && <IconAfter {...{ iconAfter, loading, variant }} />}
  </StyledButton>
);

Button.defaultProps = {
  block: false,
  circle: false,
  disabled: false,
  flat: false,
  iconAfter: '',
  iconBefore: '',
  inputSuffix: false,
  loading: false,
  outline: false,
  size: 'md',
  themeKey: 'Button',
  themeStyle: {},
  type: 'button',
  variant: 'primary',
};

Button.propTypes = {
  block: PropTypes.bool,
  circle: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]).isRequired,
  disabled: PropTypes.bool,
  flat: PropTypes.bool,
  iconAfter: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  iconBefore: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  inputSuffix: PropTypes.bool,
  loading: PropTypes.bool,
  outline: PropTypes.bool,
  size: PropTypes.string,
  themeKey: PropTypes.string,
  themeStyle: PropTypes.object,
  type: PropTypes.string,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'danger',
    'nuetral',
  ]),
};

Button.displayName = 'Button';

/** @component */
export default Button;
