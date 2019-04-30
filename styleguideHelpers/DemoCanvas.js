import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme, { colors } from 'theme';

const DemoCanvas = styled.div`
  background: ${colors.N50};
  padding: 2rem;
`;

DemoCanvas.defaultProps = {
  theme,
};

DemoCanvas.propTypes = {
  theme: PropTypes.object,
};

export default DemoCanvas;
