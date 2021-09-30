const withLess = require('next-with-less')
const path = require('path')

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})

const pathToLessFileWithVariables = path.resolve(__dirname, './assets/antd-custom.less')

let config = withMDX({
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    })
    return config
  }
})

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
const env = require('./config/importEncryptedEnv.cjs')() // this will import during build step

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    })
    return config
  },
  reactStrictMode: true,
  poweredByHeader: false,
  ...config,
  experimental: { esmExternals: true },
  env // It's required to pass environment variables here to pass them into the frontend code

}
