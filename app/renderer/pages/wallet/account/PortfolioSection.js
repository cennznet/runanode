import React from 'react';
import jdenticon from "jdenticon";

import Table from '../../../components/Table';

const { colors } = require('../../../theme');

const PortfolioSection = ({ account }) => {
  console.log('PortfolioSection');
  console.log(account);
  return <Table
    data={account && account.assets ? Object.values(account.assets) : [{}]}
    page={0}
    pageSize={10}
    columns={[
      {
        Header: '',
        accessor: 'assetId',
        Cell: row => (
          <img alt="" src={`data:image/png;base64, ${jdenticon.toPng(row.value.toString(10),200).toString('base64')}`} width="100rem"/>
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
