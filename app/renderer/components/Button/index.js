import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import styledProps from 'styled-props';
import Spinner from 'components/Spinner';
import defaultTheme from 'renderer/theme';
import defaultStyling from './defaultStyling';
import buttonStyles from './buttonStyles';

export const StyledButton = styled.button`
  ${p => buttonStyles(p)};
  margin-right: ${p => (p.inputSuffix ? '0.25rem' : '')};
  min-width: ${p => p.minWidth};
`;

StyledButton.defaultProps = {
  theme: defaultTheme,
};

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
`;

const IconAfter = ({ iconAfter, loading, color, theme }) => {
  const icon = loading ? (
    <Spinner color={styledProps(defaultStyling(theme).contrastColor, 'color')({ color })} />
  ) : (
    iconAfter
  );

  return <IconWrapper>{icon}</IconWrapper>;
};

const CustomButton = ({
  children,
  iconBefore,
  iconAfter,
  theme,
  color,
  loading,
  themeStyles,
  ...restProps
}) => (
  <StyledButton {...restProps} {...{ iconBefore, iconAfter, loading, theme, themeStyles, color }}>
    {iconBefore && <IconWrapper>{iconBefore}</IconWrapper>}
    {children}
    {(iconAfter || loading) && <IconAfter {...{ iconAfter, loading, color, theme }} />}
  </StyledButton>
);

const Button = styled(CustomButton)``;

Button.defaultProps = {
  block: false,
  color: 'primary',
  disabled: false,
  flat: false,
  iconAfter: '',
  iconBefore: '',
  inputSuffix: false,
  loading: false,
  outline: false,
  size: 'md',
  type: 'button',
  theme: defaultTheme,
  themeSpace: 'button',
  themeStyles: {},
};

Button.propTypes = {
  block: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]).isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger', 'nuetral']),
  disabled: PropTypes.bool,
  flat: PropTypes.bool,
  loading: PropTypes.bool,
  iconAfter: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  iconBefore: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  inputSuffix: PropTypes.bool,
  outline: PropTypes.bool,
  size: PropTypes.string,
  type: PropTypes.string,
  theme: PropTypes.object,
  themeSpace: PropTypes.string,
  themeStyles: PropTypes.object,
};

export default Button;
