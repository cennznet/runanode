#### Option 1 - Using `theme/media`

source code - `defaultTheme/media.js`;
Check `get-started` section to see how to config theme and media quaries in your application;

```jsx static
import { media } from 'theme';

const ResponsiveComponent = styled.div`
  height: 3rem; /* default value */

  /* Extreme small screen */
  ${media.smDown`
    height: 1rem;
  `}

  /* Small screen */
  ${media.smUp`
    height: 2rem;
  `}

  /* Medium screen */
  ${media.mdUp`
    height: 3rem;
  `}

  /* Large screen */
  ${media.lgUp`
    height: 4rem;
  `}

  /* Extra large screen */
  ${media.xlUp`
    height: 5rem;
  `}
`;
```

#### Option 2: Grid layout libraries

If you need more complex grid layout, could choose your favorate libraries, here are some recommadations:

- [Reactstrap layout components](https://reactstrap.github.io/components/layout/): [samples 1](https://github.com/cennznet/runanode.io/blob/ff2c0c2b5a4e132c442611b57a637301bfda080b/src/components/index.js) and [samples 2](https://github.com/cennznet/runanode.io/blob/d5b3119b914f5bd4468c62fa3f0fe733491923c7/src/components/Download/index.js)

- [react-awesome-styled-grid](https://github.com/santosfrancisco/react-awesome-styled-grid)

- [styled-css-grid](https://github.com/azz/styled-css-grid)
