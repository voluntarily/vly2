const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})


/* eslint-disable */
const env = require('./config/importEncryptedEnv')() // this will import during build step
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})

config = withBundleAnalyzer(withMDX({
  pageExtensions: ['js', 'jsx', 'mdx', 'md'],
}))

if (process.env.NODE_ENV === 'test') {
  // use a unique next distDir for each test
  const uuid = require('uuid/v4')
  config.distDir = path.join('.test', uuid())
}


module.exports = {
  ...config,
  env // It's required to pass environment variables here to pass them into the frontend code
}
