import React from 'react';
import styled from 'styled-components';
import { MainContent, MainLayout } from 'components/layout';
import { Scrollable, TosContent, PageHeading } from 'components';
import { colors } from 'renderer/theme';

const SettingsTosPage = ({ subNav }) => (
  <MainLayout subNav={subNav}>
    <MainContent>
      <PageHeading>Terms & Conditions</PageHeading>
      <Scrollable>
        <TosContent />
      </Scrollable>
    </MainContent>
  </MainLayout>
);

export default SettingsTosPage;
