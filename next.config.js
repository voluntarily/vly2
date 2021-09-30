const withLess = require('next-with-less')

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})

let config = withMDX({
  pageExtensions: ['js', 'jsx', 'md', 'mdx']
})

// const lessToJS = require('less-vars-to-js')
// const fs = require('fs-extra')
const path = require('path')

// next.config.js
const pathToLessFileWithVariables = path.resolve(__dirname, './assets/antd-custom.less')

config = withLess({
  ...config, 
  lessLoaderOptions: {
    /* ... */
    additionalData: (content) =>
      `${content}\n\n@import '${pathToLessFileWithVariables}';`
  }
})

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

config = withBundleAnalyzer(withMDX({
  ...config,
  pageExtensions: ['js', 'jsx', 'mdx', 'md']
}))

if (process.env.NODE_ENV === 'test') {
  // use a unique next distDir for each test
  const uuid = require('uuid/v4')
  config.distDir = path.join('.test', uuid())
}
const env = require('./config/importEncryptedEnv')() // this will import during build step

module.exports = {
  ...config,
  env // It's required to pass environment variables here to pass them into the frontend code
}
