import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from '../app/renderer/theme';

const DemoFlex = styled.div`
  display: flex;

  & > * {
    margin-right: 1rem;
  }
`;

DemoFlex.defaultProps = {
  theme,
};

DemoFlex.propTypes = {
  theme: PropTypes.object,
};

export default DemoFlex;
