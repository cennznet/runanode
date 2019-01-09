import React, { Component } from 'react';
import Layout from './Layout';
import TopBarContainer from './TopBarContainer';
import LayoutWrapper from './LayoutWrapper';

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
