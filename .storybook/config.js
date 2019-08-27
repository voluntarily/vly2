import { configure, addParameters } from '@storybook/react';
import vStoryTheme from './vStoryTheme';

addParameters({
  options: {
    theme: vStoryTheme,
  },
});

// automatically import all files ending in *.stories.js
const req = require.context('../components', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
