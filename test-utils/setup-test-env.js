// /* eslint-disable */
// // To get normal classnames instead of CSS Modules classnames for testing
// require('mock-css-modules')

// // Ignore assets
// // require.extensions['.jpg'] = noop => noop
// // require.extensions['.jpeg'] = noop => noop
// // require.extensions['.png'] = noop => noop
// // require.extensions['.gif'] = noop => noop
// // require.extensions['.md'] = noop => noop
// // require.extensions['.less'] = noop => noop

require('@babel/register')
require('@babel/polyfill')

// Enzyme mount requires a DOM which we provide here.
const { JSDOM } = require('jsdom')

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom

function copyProps (src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target)
  })
}

global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'node.js'
}

copyProps(window, global)
require('raf/polyfill') // provides requestanimationframe

// use .default export?
const Enzyme = require('enzyme')
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17')
Enzyme.configure({ adapter: new Adapter() })

// require('../../config/importEncryptedEnv')() // this will import during test step
