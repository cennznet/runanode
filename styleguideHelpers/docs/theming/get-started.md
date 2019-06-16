#### Step 1: Create `theme` folder, and structure folders and files like

``` bash
- src
  - theme
    - dark
      -- appColors.js
      -- appComponentStyle.js
      -- index.js
```

#### Step 2: Content to be filled into those three files, or could be copied from `components/defaultTheme` directory, default theming style then would be overrided by colors and component style defined in `app/src/theme/dark`

```jsx static
// src/theme/dark/appColors.js

// N0 is #FFFFFF by default, and it is redefined as #F0F0F0 in app new theme here
export const N0 = `#F0F0F0`;
```

``` jsx static
// src/theme/dark/appComponentStyle.js

/**
 * Check components/defaultTheme/components.js for available customising options
 */
const configComponentStyle = colors => ({
  // Custom Tooltip component theme style
  Tooltip: {
    background: colors.G500, // Define tooltip background color as green in new theme
    color: colors.N500, // Define tooltip font color as grey in new theme
  },
  // More component theming customising
  //...
});
export default configComponentStyle;
```

```js static
// src/theme/dark/index.js

import R from 'ramda';

import defaultTheme, { media as mediaQueries, colors as defaultColors, utils } from 'components/defaultTheme';
import mediaQueries from 'components/defaultTheme/media';

import * as appColors from './appColors';
import appComponentStyle from './appComponentStyle';

const colors = R.mergeDeepRight(defaultColors, appColors);
const media = mediaQueries(theme.breakPoints);

const customTheme = {
  colors,
  components: appComponentStyle(colors),
};
const theme = R.mergeDeepRight(defaultTheme, customTheme);

const media = mediaQueries(theme.breakPoints);

export { colors, media, utils };
export default theme;
```

#### Step3: Import `theme/dark/index.js` to `ThemeProvider` which is in root file

```jsx static
// src/index.js

import { ThemeProvider } from 'styled-components';
import darkTheme from 'src/theme/dark/index.js';

const rootElement = document.getElementById('root');

render(
  <ThemeProvider theme={darkTheme}>
    <App />
  <ThemeProvider />,
  rootElement
);
```
