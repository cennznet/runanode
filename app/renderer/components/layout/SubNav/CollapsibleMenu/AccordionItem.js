import { AccordionItem } from 'react-sanfona';
import styled from 'styled-components';

const StyledAccordionItem = styled(AccordionItem)`
  .react-sanfona-item__chevron {
    border: ${p => `1px solid ${p.theme.colors.N0}`};
    border-width: 0 1px 1px 0;
    display: inline-block;
    margin-left: 1.3rem;
    padding: 0.3rem;
    transform: rotate(45deg);
  }

  &.react-sanfona-item-expanded {
    .react-sanfona-item__chevron {
      transform: rotate(-135deg);
    }
  }
`;

export default StyledAccordionItem;
