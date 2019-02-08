import React from 'react';
import Table from '../../../components/Table';

const util = require('../../../../../styleguideHelpers/tableDataUtil');
const { colors } = require('../../../theme');

const PortfolioSection = ({ account }) => {
  return <Table
    data={account && account.assets ? Object.values(account.assets) : [{}]}
    page={0}
    pageSize={10}
    columns={[
      {
        Header: '',
        accessor: 'iconBase64',
        Cell: row => (
          <img alt="" src={`data:image/png;base64, ${row.value}`} width="100rem"/>
        ),
      },
      {
        Header: 'Asset Name',
        id: 'assetName',
        accessor: d => d.name,
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
        accessor: 'reservedBalance',
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
        accessor: d => d.freeBalance,
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
        accessor: 'totalBalance',
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
