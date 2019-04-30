import React from 'react';
import styled from 'styled-components';
import { MainContent, MainLayout } from 'components/layout';
import { Scrollable, TosContent, PageHeading } from 'components';
import { colors } from 'theme';

const SettingsTosPage = ({ subNav }) => (
  <MainLayout subNav={subNav}>
    <MainContent>
      <Scrollable>
        <TosContent />
      </Scrollable>
    </MainContent>
  </MainLayout>
);

export default SettingsTosPage;
