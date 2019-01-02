import { configure, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';

addDecorator(withNotes);

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
