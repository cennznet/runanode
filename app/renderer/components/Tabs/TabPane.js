import React from 'react';
import styled from 'styled-components';
import { TabPane as RcTabPane } from 'rc-tabs';
import Scrollable from '../Scrollable';

const StyledPane = styled(RcTabPane)`
  padding-top: 2rem;
`;

const TabPane = ({ children, styles, withScrollable, ...props }) => (
  <StyledPane {...props}>
    {
      withScrollable ?
        <Scrollable styles={{ height: styles.scrollHeight }} gradientBottom>
          {children}
        </Scrollable>
        :
        children
    }

  </StyledPane>
);

TabPane.defaultProps = {
  styles: {
    scrollHeight: '80vh',
  },
  withScrollable: false,
};

export default TabPane;
