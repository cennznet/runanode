import React, { useEffect, useState } from 'react';
import Button from 'components/Button';
import styled from 'styled-components';
import Spinner from 'components/Spinner';
import { Layout, LayoutWrapper, MainContent } from 'components/layout';
import SideNav from 'components/layout/SideNav';
import SimpleSidebar from 'components/layout/SimpleSidebar';
import { Logger } from 'renderer/utils/logging';
import { environment } from 'common/environment';
import { colors } from 'theme';
import ROUTES from '../../constants/routes';
import withContainer from './container';

const { isDevOrDebugProd } = environment;

const SpinnerWrapper = styled.div`
  height: 50%;
  align-items: center;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
`;

const ResetStorageSection = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  margin-top: 2rem;
`;

const ResetStorageTitle = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 30px;
`;

const ResetStorageDesc = styled.div`
  font-size: 16px;
  line-height: 2rem;
  text-align: center;
  color: ${colors.textMuted};
  padding: 1rem;
`;

const HomePage = ({
  hasBlockNumbers,
  onPageNavigation,
  onSubscribeCennznetStatus,
  onResetLocalStorage,
  match,
}) => {
  const [isShowResetSection, setIsShowResetSection] = useState(false);

  useEffect(() => {
    const sectionResetTimer = setTimeout(() => {
      const { path } = match;
      if (path === ROUTES.ROOT) {
        setIsShowResetSection(true);
      }
    }, 40000);

    return function cleanup() {
      clearTimeout(sectionResetTimer);
    };
  }, []);

  useEffect(() => {
    Logger.debug(`HomePage, hasBlockNumbers: ${hasBlockNumbers}`);
    if (hasBlockNumbers) {
      onPageNavigation();
    }
  }, [hasBlockNumbers]);

  return (
    <Layout sidebar={isDevOrDebugProd ? <SideNav /> : <SimpleSidebar />}>
      <LayoutWrapper>
        <MainContent>
          <SpinnerWrapper>
            <Spinner size="xl" />
          </SpinnerWrapper>
          {isShowResetSection && (
            <ResetStorageSection>
              <ResetStorageTitle>Taking a while to load?</ResetStorageTitle>
              <ResetStorageDesc>
                We suggest that you try reseting your local storage on this device to solve this
                problem. If you have used the node before, then resetting your storage will clear
                all your imported wallets and preference settings. You can get your wallet back by
                importing it.
              </ResetStorageDesc>
              <Button
                lg
                onClick={() => {
                  onResetLocalStorage();
                }}
              >
                Reset
              </Button>
            </ResetStorageSection>
          )}
        </MainContent>
      </LayoutWrapper>
    </Layout>
  );
};
export default withContainer(HomePage);
