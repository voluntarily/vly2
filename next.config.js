/* eslint-disable */
require('./config/importEncryptedEnv')();
const withLess = require('@zeit/next-less')
const withCSS = require('@zeit/next-css')
const lessToJS = require('less-vars-to-js')
const fs = require('fs-extra')
const path = require('path')

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
)

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {}
}

let config = withLess({
  // cssModules: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables // make your antd custom effective
  }
})
config = withCSS({
  ...config,
  cssModules: false
})

if (process.env.NODE_ENV === 'test') {
  // use a unique next distDir for each test
  const uuid = require('uuid/v4')
  config.distDir = path.join('.test', uuid())
}

module.exports = config
