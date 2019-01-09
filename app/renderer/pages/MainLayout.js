// @flow
import React, { Component } from 'react';
import Layout from 'renderer/components/layout/Layout';
import LayoutWrapper from 'renderer/components/layout/LayoutWrapper';
import TopBarContainer from './TopBarContainer';

export default class MainLayout extends Component {
  render() {
    const { subNav } = this.props;
    return (
      <Layout topbar={<TopBarContainer />} defaultSidebar>
        <LayoutWrapper>
          {subNav}
          {this.props.children}
        </LayoutWrapper>
      </Layout>
    );
  }
}
