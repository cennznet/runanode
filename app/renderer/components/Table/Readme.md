```jsx
const util = require('../../../../styleguideHelpers/tableDataUtil');
const { colors } = require('../../theme');

initialState = {
  page: 0,
  pageSize: 5,
};

<Table
  data={util.makeData()}
  page={state.page}
  pageSize={state.pageSize}
  columns={[
    {
      Header: 'First Name',
      accessor: 'firstName',
    },
    {
      Header: 'Last Name',
      id: 'lastName',
      accessor: d => d.lastName,
    },
    {
      Header: 'Age',
      accessor: 'age',
      width: 80,
    },
    {
      Header: () => (
        <div
          style={{
            width: '100%',
            textAlign: 'right',
          }}
        >
          Balance ($)
        </div>
      ),
      accessor: 'balance',
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
      Header: 'Progress',
      accessor: 'progress',
      Cell: row => (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: colors.V600,
          }}
        >
          <div
            style={{
              width: `${row.value}%`,
              height: '100%',
              backgroundColor:
                row.value > 66 ? colors.success : row.value > 33 ? colors.warning : colors.danger,
              borderRadius: '2px',
              transition: 'all .2s ease-out',
            }}
          />
        </div>
      ),
    },
  ]}
  showPaginationBottom={false}
/>;
```
