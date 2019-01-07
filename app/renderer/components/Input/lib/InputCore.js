import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from 'renderer/theme';
import inputCoreStyles from './inputCoreStyles';

const InputCore = styled.input`
  ${p => inputCoreStyles(p)};
`;

InputCore.defaultProps = {
  valid: true,
  theme,
  themeSpace: 'input',
};

InputCore.propTypes = {
  valid: PropTypes.bool,
  theme: PropTypes.object,
};

export default InputCore;
