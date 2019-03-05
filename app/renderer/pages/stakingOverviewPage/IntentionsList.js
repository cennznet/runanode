import React from 'react';
import jdenticon from 'jdenticon';
import styled from 'styled-components';
import SVGInline from 'react-svg-inline';
import { Ellipsis, Table } from 'components';
import { colors } from 'renderer/theme';

const ListWrapper = styled.div`
  width: 49%;
`;

const NoDataText = styled.div`
  margin: 1rem;
`;

const IntentionsList = ({ intentions }) => {
  const titleSuffix = intentions.length ? `(${intentions.length})` : '';
  return (
    <ListWrapper>
      <Table
        NoDataComponent={() => <NoDataText>There’s no intention in the queue.</NoDataText>}
        data={intentions}
        page={0}
        pageSize={100}
        columns={[
          {
            Header: () => (
              <div
                style={{
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                {`Pool ${titleSuffix}`}
              </div>
            ),
            id: 'intentions',
            accessor: d => d,
            Cell: row => {
              return (
                <div
                  style={{
                    color: colors.N300,
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <Ellipsis substrLength={8}>{row.value.toString()}</Ellipsis>
                </div>
              );
            },
          },
          {
            // TODO: Handle later
            Header: () => (
              <div
                style={{
                  width: '100%',
                  textAlign: 'right',
                }}
              >
                Amount (CENNZ)
              </div>
            ),
            id: 'balances',
            accessor: d => d,
            Cell: row => {
              return (
                <div
                  style={{
                    color: colors.N300,
                    width: '100%',
                    textAlign: 'right',
                  }}
                >
                  0
                </div>
              );
            },
          },
        ]}
        showPaginationBottom={false}
      />
    </ListWrapper>
  );
};

export default IntentionsList;
