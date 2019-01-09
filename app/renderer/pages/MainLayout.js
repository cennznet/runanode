// @flow
import React, { Component } from 'react';
import Layout from '../components/layout/Layout';
import TopBarContainer from './TopBarContainer';
import LayoutWrapper from '../components/layout/LayoutWrapper';

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
