const fs = require('fs-extra')
const path = require('path')

const keys = {
  development: {
    VLY_PRIVATE_KEY: fs.readFileSync(path.resolve(process.cwd(), 'lib/sec/dev.priv.pem')).toString(),
    VLY_PUBLIC_KEY: fs.readFileSync(path.resolve(process.cwd(), 'lib/sec/dev.pub.pem')).toString()
  },

  test: {
    VLY_PRIVATE_KEY: fs.readFileSync(path.resolve(process.cwd(), 'lib/sec/dev.priv.pem')).toString(),
    VLY_PUBLIC_KEY: fs.readFileSync(path.resolve(process.cwd(), 'lib/sec/dev.pub.pem')).toString()
  },

  production: {
    VLY_PUBLIC_KEY: process.env.VLY_PUBLIC_KEY || 'Please set the public key',
    VLY_PRIVATE_KEY: process.env.VLY_PRIVATE_KEY || 'Please set the private key'
  }
}

const privateKey = () => keys[process.env.NODE_ENV].VLY_PRIVATE_KEY
const publicKey = () => keys[process.env.NODE_ENV].VLY_PUBLIC_KEY

module.exports = {
  privateKey,
  publicKey
}
