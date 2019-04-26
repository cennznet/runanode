import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import theme from '../app/renderer/components/defaultTheme';

const ThemeWrapper = ({ children }) => <ThemeProvider {...{ theme }}>{children}</ThemeProvider>;

ThemeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeWrapper;
