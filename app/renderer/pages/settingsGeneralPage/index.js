import React from 'react';
import styled from 'styled-components';
import { MainContent, MainLayout } from 'components/layout';
import { Toggle, PageHeading } from 'components';
import { colors } from 'renderer/theme';
import packageJson from '../../../../package.json';
import withContainer from './container';

const List = styled.div``;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 6rem;
  border-bottom: 1px solid ${colors.border};
`;

const Text = styled.div`
  margin-right: 2rem;
`;

const SettingsGeneralPage = ({ subNav, rememberNetwork, onToggleRememberNetwork }) => (
  <MainLayout subNav={subNav}>
    <MainContent>
      <PageHeading marginBottom="0">General</PageHeading>
      <List>
        <ListItem>CENNZNode version {packageJson.version}</ListItem>
        <ListItem>
          <Text>
            Remember my network preference, so I do not need to choose network everytime I open the
            app
          </Text>
          <Toggle
            defaultChecked={rememberNetwork}
            onChange={e => {
              console.log('rememberNetwork', rememberNetwork);
              onToggleRememberNetwork(!rememberNetwork);
            }}
          />
        </ListItem>
      </List>
    </MainContent>
  </MainLayout>
);

export default withContainer(SettingsGeneralPage);
