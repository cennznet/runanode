import React from 'react';
import { withRouter } from 'react-router-dom'

import ErrorPage from 'renderer/pages/errorPage';
import { colors } from 'renderer/theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import { Button, PageHeading, Scrollable } from 'components';
import withContainer from './container';

class ErrorBoundaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo
    })
    // You can also log error messages to an error reporting service here
  }


  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <ErrorPage error={this.state.error} errorInfo={this.state.errorInfo} />
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default withRouter(withContainer(ErrorBoundaryPage));
