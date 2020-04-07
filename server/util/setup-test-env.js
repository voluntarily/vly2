/* eslint-disable */
// To get normal classnames instead of CSS Modules classnames for testing
require('mock-css-modules')

// Ignore assets
require.extensions['.jpg'] = noop => noop
require.extensions['.jpeg'] = noop => noop
require.extensions['.png'] = noop => noop
require.extensions['.gif'] = noop => noop
require.extensions['.md'] = noop => noop
require.extensions['.less'] = noop => noop

require('@babel/register')
require('@babel/polyfill')
require('raf/polyfill')

const jsdom = require('jsdom')
const { JSDOM } = jsdom
global.window = (new JSDOM('<body></body>')).window
global.document = window.document
global.navigator = window.navigator

// use .default export?
const Enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
Enzyme.configure({ adapter: new Adapter() })

require('../../config/importEncryptedEnv')() // this will import during test step
