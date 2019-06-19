import PropTypes from 'prop-types';
import styled from 'styled-components';
import inputCoreStyles from './inputCoreStyles';

const InputCore = styled.input`
  ${p => inputCoreStyles(p)};
`;

InputCore.defaultProps = {
  valid: true,
};

InputCore.propTypes = {
  valid: PropTypes.bool,
  themeKey: PropTypes.string.isRequired,
};

export default InputCore;
