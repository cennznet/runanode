import React from 'react';
import jdenticon from "jdenticon";
import styled from 'styled-components';
import SVGInline from "react-svg-inline";
import Table from 'components/Table';

const { colors } = require('../../../theme');

const AssetIdIcon = ({value}) => {
  const SVG = styled(SVGInline).attrs({
    svg: jdenticon.toSvg(value, 50),
  })`
  width: auto;
`;
  return <SVG />;
}

const PortfolioSection = ({ account }) => {
  return <Table
    data={account && account.assets ? Object.values(account.assets) : [{}]}
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
              <div style={{lineHeight: '3rem'}}>
                {row.value.name}
              </div>
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
            Reserved
          </div>
        ),
        // accessor: 'reservedBalance',
        id: 'reservedBalance',
        accessor: d => d.reservedBalance.toString,
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
            Free
          </div>
        ),
        id: 'freeBalance',
        accessor: d => d.freeBalance.toString,
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
        accessor: d => d.totalBalance.toString,
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
  />;
};

export default PortfolioSection;
