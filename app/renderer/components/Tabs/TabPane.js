import React from 'react';
import styled from 'styled-components';
import { TabPane as RcTabPane } from 'rc-tabs';

const TabPane = styled(RcTabPane)`
  min-height: calc(100vh - 214px); /** nav:64px, Tabs:46px; footer:88px; */
`;

export default TabPane;
