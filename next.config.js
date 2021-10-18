const withLess = require('next-with-less')

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const path = require('path')
const pathToLessFileWithVariables = path.resolve(__dirname, './assets/antd-custom.less')

const config = withBundleAnalyzer(withMDX(withLess({
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],

  lessLoaderOptions: {
    /* ... */
    additionalData: (content) =>
      `${content}\n\n@import '${pathToLessFileWithVariables}';`
  }
})))

if (process.env.NODE_ENV === 'test') {
  // use a unique next distDir for each test
  const { v4: uuid } = require('uuid')
  config.distDir = path.join('.test', uuid())
}
const env = require('./config/importEncryptedEnv')() // this will import during build step

module.exports = {
  ...config,
  env // It's required to pass environment variables here to pass them into the frontend code
}
