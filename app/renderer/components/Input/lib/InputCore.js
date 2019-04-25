import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from 'renderer/theme';
import inputCoreStyles from './inputCoreStyles';

const InputCore = styled.input`
  ${p => inputCoreStyles(p)};
`;

InputCore.defaultProps = {
  valid: true,
};

InputCore.propTypes = {
  valid: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  themeKey: PropTypes.string.isRequired,
  computedThemeStyle: PropTypes.object.isRequired,
};

export default InputCore;
