import React from 'react';
import jdenticon from 'jdenticon';
import styled from 'styled-components';
import SVGInline from 'react-svg-inline';
import { Ellipsis, Table } from 'components';
import theme, { colors } from 'theme';

const ListWrapper = styled.div`
  width: 49%;
`;

const NoDataText = styled.div`
  margin: 1rem;
`;

const YourAccountText = styled.div`
  margin: 0 0.4rem;
`;

const ValidatorsList = ({ validators, stakingStashAccountAddress }) => {
  const titleSuffix = validators.length ? `(${validators.length})` : '';
  return (
    <ListWrapper>
      <Table
        NoDataComponent={() => <NoDataText>There’s no validator in current session.</NoDataText>}
        data={validators}
        page={0}
        pageSize={100}
        getTrProps={(state, rowInfo, column) => {
          if (rowInfo.row.validators) {
            return {
              style: {
                background:
                  rowInfo.row.validators.address === stakingStashAccountAddress &&
                  theme.listitemHighlightGradient,
              },
            };
          }
        }}
        columns={[
          {
            Header: () => (
              <div
                style={{
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                {`Validators ${titleSuffix}`}
              </div>
            ),
            id: 'validators',
            accessor: d => d,
            Cell: ({ value }) => {
              return (
                <div
                  style={{
                    color: colors.text,
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                  }}
                >
                  <Ellipsis substrLength={6}>{(value && value.address) || 'Error'}</Ellipsis>
                  {value && value.address === stakingStashAccountAddress && (
                    <YourAccountText>(You)</YourAccountText>
                  )}
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
                Balance (CENNZ)
              </div>
            ),
            id: 'validators',
            accessor: d => d,
            Cell: ({ value }) => {
              return (
                <div
                  style={{
                    color: colors.N300,
                    width: '100%',
                    textAlign: 'right',
                  }}
                >
                  <Ellipsis substrLength={6}>{(value && value.cennzBalance) || 'Error'}</Ellipsis>
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

export default ValidatorsList;
