import React from 'react';
import styled from 'styled-components';
import { MainContent } from 'components/layout';
import MainLayout from 'renderer/components/layout/MainLayout';
import Toggle from 'components/Toggle';
import { colors } from 'renderer/theme';
import packageJson from '../../../../package.json';

const PageHeading = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

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

const ProfileGeneralPage = ({ subNav }) => (
  <MainLayout subNav={subNav}>
    <MainContent>
      <PageHeading>General</PageHeading>
      <List>
        <ListItem>CENNZNode version {packageJson.version}</ListItem>
        <ListItem>
          <Text>
            Remember my network preference, so I donnot need to choose network everytime I open the
            app
          </Text>
          <Toggle defaultChecked onChange={e => {}} />
        </ListItem>
      </List>
    </MainContent>
  </MainLayout>
);

export default ProfileGeneralPage;
