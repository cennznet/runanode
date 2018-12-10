import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

export default class AppThemeProvider extends Component {
  componentWillMount() {
    const { globalStyles } = this.props;
    this.stylesheet = document.createElement('style');
    this.stylesheet.type = 'text/css';
    this.stylesheet.innerHTML = globalStyles;

    if (document && document.head) {
      document.head.appendChild(this.stylesheet);
    }
  }

  componentWillUnmount() {
    if (this.stylesheet && document && document.head) {
      document.head.removeChild(this.stylesheet);
      delete this.stylesheet;
    }
  }

  render() {
    const { theme, children } = this.props;
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
  }
}

AppThemeProvider.propTypes = {
  theme: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
};
