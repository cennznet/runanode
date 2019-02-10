import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from '../app/renderer/theme';

const DemoFlex = styled.div`
  display: flex;
  justify-content: ${p => p.justifyContent};
  flex-wrap: wrap;

  & > * {
    margin-right: 1rem;
  }
`;

DemoFlex.defaultProps = {
  theme,
  justifyContent: 'none',
};

DemoFlex.propTypes = {
  theme: PropTypes.object,
};

export default DemoFlex;
