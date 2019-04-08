import React from 'react';
import R from 'ramda';
import jdenticon from 'jdenticon';
import styled from 'styled-components';
import SVGInline from 'react-svg-inline';
import Table from 'components/Table';
import { colors } from 'renderer/theme';
import Scrollable from 'components/Scrollable';

const AssetIdIcon = ({ value }) => {
  const SVG = styled(SVGInline).attrs({
    svg: jdenticon.toSvg(value, 50),
  })`
    width: auto;
  `;
  return <SVG />;
};

const PortfolioSection = ({ accountBalances }) => {
  if (!accountBalances) {
    return null; // TODO: Refactor to loading spinner
  }

  return (
    <Scrollable styles={{height: '60vh'}}>
      <Table
        data={(accountBalances && Object.values(accountBalances)) || [{}]}
        page={0}
        pageSize={100}
        columns={[
          {
            Header: 'Asset Name',
            id: 'assetName',
            accessor: d => d,
            width: 230,
            Cell: row => {
              return (
                <div
                  style={{
                    display: 'flex',
                    color: colors.N0,
                  }}
                >
                  <AssetIdIcon value={row.value.assetId} />
                  <div style={{ lineHeight: '3rem', marginLeft: '1rem' }}>{row.value.name}</div>
                </div>
              );
            },
          },
          {
            Header: () => (
              <div
                style={{
                  width: '100%',
                  textAlign: 'right',
                }}
              >
                Outgoing
              </div>
            ),
            // accessor: 'reservedBalance',
            id: 'reservedBalance',
            accessor: d => (d && d.reservedBalance ? d.reservedBalance.toString : ''),
            Cell: row => {
              return (
                <div
                  style={{
                    color: colors.N300,
                    width: '100%',
                    textAlign: 'right',
                  }}
                >
                  {row.value}
                </div>
              );
            },
          },
          {
            Header: () => (
              <div
                style={{
                  width: '100%',
                  textAlign: 'right',
                }}
              >
                Free balance
              </div>
            ),
            id: 'freeBalance',
            accessor: d => (d && d.freeBalance ? d.freeBalance.toString : ''),
            Cell: row => {
              return (
                <div
                  style={{
                    color: colors.N300,
                    width: '100%',
                    textAlign: 'right',
                  }}
                >
                  {row.value}
                </div>
              );
            },
          },
          {
            Header: () => (
              <div
                style={{
                  width: '100%',
                  textAlign: 'right',
                }}
              >
                Total balance
              </div>
            ),
            id: 'totalBalance',
            accessor: d => (d && d.totalBalance ? d.totalBalance.toString : ''),
            Cell: row => {
              return (
                <div
                  style={{
                    color: colors.N300,
                    width: '100%',
                    textAlign: 'right',
                  }}
                >
                  {row.value}
                </div>
              );
            },
          },
        ]}
        showPaginationBottom={false}
      />
    </Scrollable>
  );
};

export default PortfolioSection;
