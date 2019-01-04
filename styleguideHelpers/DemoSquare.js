import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from '../app/renderer/theme';

const { colors } = theme;

const DemoSquare = styled.div`
  background-color: ${colors.primary};
  width: 100%;
  height: 2rem;
  margin-bottom: 0.5rem;
`;

DemoSquare.defaultProps = {
  theme,
};

DemoSquare.propTypes = {
  theme: PropTypes.object,
};

export default DemoSquare;
