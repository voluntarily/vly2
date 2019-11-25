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
    VLY_PUBLIC_KEY: process.env.VLY_PUBLIC_KEY || fs.readFileSync(path.resolve(process.cwd(), 'lib/sec/prod.pub.pem')).toString(),
    VLY_PRIVATE_KEY: process.env.VLY_PRIVATE_KEY || 'Please set the private key'
  }
}

export const privateKey = () => keys[process.env.NODE_ENV].VLY_PRIVATE_KEY
export const publicKey = () => keys[process.env.NODE_ENV].VLY_PUBLIC_KEY
