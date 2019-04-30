import React from 'react';
import { withRouter } from 'react-router-dom'

import ErrorPage from 'renderer/pages/errorPage';
import { colors } from 'theme';
import { Layout, LayoutWrapper, MainContent, SimpleSidebar } from 'components/layout';
import { Button, PageHeading, Scrollable } from 'components';
import appConfig from 'app/config';
import withContainer from './container';

// eslint-disable-next-line
let { Raven } = window;

let ravenEnabled = true;
if (!Raven || !appConfig.app.sentryDSN) {
  // raven is not loaded or blocked
  // or sentry is not enabled
  const dummy = () => Raven;
  Raven = {
    config: dummy,
    install: dummy,
    captureException: (...args) => console.error(...args), // eslint-disable-line
    lastEventId: () => null,
    showReportDialog: dummy,
    setUserContext: dummy
  };

  ravenEnabled = false;
}

Raven.config(appConfig.app.sentryDSN, {
  environment: process.env.NODE_ENV,
  release: window.SENTRY_RELEASE ? window.SENTRY_RELEASE.id : `${process.env.npm_package_version}-${process.env.npm_package_gitHead}`,
  sanitizeKeys: [/password/i, /token$/i, /secret$/i, /secretKey$/i, /privateKey$/i, /pass$/i],
  debug: process.env.NODE_ENV !== 'production',
  whitelistUrls: [/.*/]
}).install();

export { Raven };

class ErrorBoundaryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  _handleContactUsClick = () => {
    if (Raven.lastEventId()) {
      // https://docs.sentry.io/enriching-error-data/user-feedback/?platform=javascript
      Raven.showReportDialog({
        labelSubmit: 'Submit',
      });
    }
  };

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo
    })
    // You can also log error messages to an error reporting service here
    Raven.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <ErrorPage error={this.state.error} errorInfo={this.state.errorInfo} handleContactUsClick={this._handleContactUsClick} />
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default withRouter(withContainer(ErrorBoundaryPage));
