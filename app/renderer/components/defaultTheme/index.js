import * as colors from './colors';
import mediaQueries from './media';
import * as utils from './utils';
import components from './components';

const theme = {
  borderRadius: '3px',
  colors: { ...colors },
  utils: { ...utils },
  fontSizeSm: '12px',
  fontSize: '14px',
  fontSizeLg: '1rem',
  fontFamily: `-apple-system,BlinkMacSystemFont,'SegoeUI','Roboto','FiraSans',Oxygen-Sans,'Ubuntu','HelveticaNeue',sans-serif`,
  zIndex: {
    overlay: 20,
    above: 10,
    bump: 1,
    below: -1,
  },
  components: components(colors),
};

const media = mediaQueries();

export { colors, media, utils };

export default theme;
