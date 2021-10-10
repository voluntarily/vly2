/* eslint-disable */
// require('@babel/register')

// skip compiling css files.  Prevents errors loading AntD. 
const addHook = require('pirates').addHook;
addHook(
  (code, filename) => "", 
  { exts: ['.css', '.md'], ignoreNodeModules: false }
);

// require('@babel/polyfill')

const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
require('raf/polyfill')
copyProps(window, global);

// use .default export?
const Enzyme = require('enzyme')
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17')
Enzyme.configure({ adapter: new Adapter() })

require('../../config/importEncryptedEnv')() // this will import during test step

/** mock required for AndD  */
Object.defineProperty(window, 'matchMedia', {
  value: () => {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    };
  }
})