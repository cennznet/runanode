import React from 'react';
import styled from 'styled-components';
import { TabPane as RcTabPane } from 'rc-tabs';
import Scrollable from '../Scrollable';

const StyledPane = styled(RcTabPane)`
  padding-top: 2rem;
`;

const TabPane = ({ children, styles, ...props }) => (
  <StyledPane {...props}>
    <Scrollable styles={{ height: styles.scrollHeight }}>{children}</Scrollable>
  </StyledPane>
);

TabPane.defaultProps = {
  styles: {
    scrollHeight: '80vh',
  },
};

export default TabPane;
