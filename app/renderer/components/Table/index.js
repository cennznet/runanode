import styled from 'styled-components';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import theme, { colors } from 'renderer/components/defaultTheme';

const Table = styled(ReactTable)`
  &.ReactTable {
    .rt-thead {
      &.-header {
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
        background: ${colors.V900};

        .rt-resizable-header {
          font-size: 16px;
          height: 3rem;

          .rt-resizable-header-content {
            width: 100%;
          }
        }
      }

      .rt-th {
        display: flex;
        height: 2rem;
        align-items: center;
        font-weight: 500;
        text-align: left;
        border-right: 0;
        padding: 0 1rem;

        &:focus {
          outline: none;
        }

        .rt-resizer {
          width: 0;
        }
      }
    }

    .rt-tbody {
      .rt-tr-group {
        border-bottom: 0;

        .rt-tr {
          &.-odd {
            background: rgba(8, 24, 127, 0.7);
          }

          &.-even {
            background: rgba(8, 24, 127, 0.3);
          }
        }
        .rt-td {
          display: flex;
          align-items: center;
          min-height: ${p => (p.intensive ? '2rem' : '4.5rem')};
          border-right: 0;
          padding: 1rem;
        }
      }
    }
  }
`;

Table.defaultProps = {
  showPagination: false,
  intensive: false,
  minRows: 0,
  theme,
  themeKey: 'Table',
  themeStyle: {},
};

Table.displayName = 'Table';

/** @component */
export default Table;
