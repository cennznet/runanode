import React from 'react';
import styled from 'styled-components';
import { MainContent, MainLayout } from 'components/layout';
import { Toggle, PageHeading } from 'components';
import { colors } from 'renderer/theme';
import packageJson from '../../../../package.json';
import withContainer from './container';

const Label = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2rem;

  span {
    margin-top: 0.5rem;
    color: ${colors.textMuted};
  }
`;

const VersionSection = styled.div`
  height: 4rem;
`;

const PreferenceSection = styled.div`
  display: flex;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${colors.border};
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${colors.border};
`;

const PreferenceHeader = styled.div`
  min-width: 9rem;
  padding-top: 1rem;
  font-weight: 600;
`;

const PreferenceBody = styled.div`
  flex: 1 auto;
  line-height: 1.2rem;
`;

const PreferenceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;

  & + & {
    border-top: 1px solid ${colors.border};
  }
`;

const SettingsGeneralPage = ({
  subNav,
  rememberNetwork,
  onToggleRememberNetwork,
  enableAnalytics,
  onToggleEnableAnalytics,
}) => (
  <MainLayout subNav={subNav}>
    <MainContent>
      <PageHeading marginBottom="0">Settings</PageHeading>
      <VersionSection>CENNZNode version {packageJson.version}</VersionSection>
      <PreferenceSection>
        <PreferenceHeader>Preference</PreferenceHeader>
        <PreferenceBody>
          <PreferenceItem>
            <Label>
              Remember my network preference the app
              <span>Remember network choices between sessions.</span>
            </Label>
            <Toggle
              defaultChecked={rememberNetwork === null ? true : rememberNetwork}
              onChange={e => {
                onToggleRememberNetwork(rememberNetwork === null ? false : !rememberNetwork);
              }}
            />
          </PreferenceItem>
          <PreferenceItem>
            <Label>
              Enable analytics
              <span>
                We collect basic information (for example country of origin, operation system,
                application version number) to help improve our user experiences. Data is only used
                in aggregate and is never shared with any third parties.
              </span>
            </Label>
            <Toggle
              defaultChecked={enableAnalytics === null ? true : enableAnalytics}
              onChange={e => {
                onToggleEnableAnalytics(enableAnalytics === null ? false : !enableAnalytics);
              }}
            />
          </PreferenceItem>
        </PreferenceBody>
      </PreferenceSection>
    </MainContent>
  </MainLayout>
);

export default withContainer(SettingsGeneralPage);
