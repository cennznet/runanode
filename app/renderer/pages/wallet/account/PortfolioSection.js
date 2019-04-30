import React from 'react';
import R from 'ramda';
import jdenticon from 'jdenticon';
import styled from 'styled-components';
import SVGInline from 'react-svg-inline';
import Table from 'components/Table';
import { colors } from 'theme';
import { Ellipsis, Scrollable } from 'components';

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
    <Scrollable themeStyle={{ height: '60vh' }}>
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
                    color: colors.text,
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
            accessor: ({ reservedBalance }) => {
              return (
                reservedBalance && (
                  <Ellipsis substrLength="5" maxLength="15" tailLength="5">
                    {reservedBalance.toString || ''}
                  </Ellipsis>
                )
              );
            },
            Cell: row => {
              return (
                <div
                  style={{
                    color: colors.text,
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
            accessor: ({ freeBalance }) => {
              return (
                freeBalance && (
                  <Ellipsis substrLength="5" maxLength="15" tailLength="5">
                    {freeBalance.toString || ''}
                  </Ellipsis>
                )
              );
            },
            Cell: row => {
              return (
                <div
                  style={{
                    color: colors.text,
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
            accessor: ({ totalBalance }) =>
              totalBalance && (
                <Ellipsis substrLength="5" maxLength="15" tailLength="5">
                  {totalBalance.toString || ''}
                </Ellipsis>
              ),
            Cell: row => {
              return (
                <div
                  style={{
                    color: colors.text,
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
