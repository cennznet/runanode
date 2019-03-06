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

const ValidatorsList = ({ validators }) => {
  const titleSuffix = validators.length ? `(${validators.length})` : '';
  return (
    <ListWrapper>
      <Table
        NoDataComponent={() => <NoDataText>There’s no validator in current session.</NoDataText>}
        data={validators}
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
                {`Validators ${titleSuffix}`}
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
                    textAlign: 'left',
                  }}
                >
                  <Ellipsis substrLength={8}>{(value && value.address) || 'Error'}</Ellipsis>
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
                  <Ellipsis substrLength={8}>{(value && value.cennzBalance) || 'Error'}</Ellipsis>
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
