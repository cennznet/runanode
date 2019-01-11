import React from 'react';
import Button from 'components/Button';
import { MainContent } from 'components/layout';
import MainLayout from 'renderer/components/layout/MainLayout';
import styled from "styled-components";
import * as colors from '../../theme/colors';
import withContainer from './dev.container';

const PageTitle = styled.div`
  color: ${colors.N0};
  font-weight: 600;
  font-size: 1.7rem;
  margin: 3rem auto;
`;

const DevPage = ({ onNetworkStatusClick, onRestartNodeClick }) => {
    return (
      <MainLayout>
        <MainContent>
          <PageTitle>
            <h1>Dev Page</h1>
          </PageTitle>
          <Button onClick={onNetworkStatusClick} >Get Network Status</Button>
          <Button onClick={onRestartNodeClick} >Restart node</Button>
        </MainContent>
      </MainLayout>
    );
}
export default withContainer(DevPage);
