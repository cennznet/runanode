import React from 'react';
import styled from 'styled-components';
import theme from 'renderer/theme';
import R from 'ramda';
import Notification from 'components/Notification';
import TopBar from '../TopBar';
import SideNav from '../SideNav';
import withContainer from './container';
import getNotificationByType from './notificationTemplates';

const PageWrapper = styled.div`
  height: 100vh;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  height: ${p => (p.hasTopBar ? 'calc(100% - 80px)' : '100%')};
  min-height: 40rem;
`;

const Content = styled.div`
  background: ${theme.pageGradient};
  flex: 1 auto;
`;

const Layout = ({ topBar, defaultTopBar, sidebar, defaultSidebar, notificationBar, children }) => {
  const notificationType = R.prop('type')(notificationBar);
  console.log('notificationBar', notificationBar);
  console.log('notificationType', notificationType);
  return (
    <PageWrapper>
      {defaultTopBar ? <TopBar /> : topBar}
      {notificationType && <Notification>{getNotificationByType(notificationType)}</Notification>}
      <ContentWrapper hasTopBar={!!topBar || !!defaultTopBar}>
        {defaultSidebar ? <SideNav /> : sidebar}
        <Content>{children}</Content>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default withContainer(Layout);
