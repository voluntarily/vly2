const fs = require('fs-extra')
const path = require('path')

const keys = {
  development: {
    VLY_PRIVATE_KEY: fs.readFileSync(path.resolve(__dirname, './dev.priv.pem')).toString(),
    VLY_PUBLIC_KEY: fs.readFileSync(path.resolve(__dirname, './dev.pub.pem')).toString()
  },

  test: {
    VLY_PRIVATE_KEY: fs.readFileSync(path.resolve(__dirname, './test.priv.pem')).toString(),
    VLY_PUBLIC_KEY: fs.readFileSync(path.resolve(__dirname, './test.pub.pem')).toString()
  },

  production: {
    VLY_PUBLIC_KEY: process.env.VLY_PUBLIC_KEY || fs.readFileSync(path.resolve(__dirname, './prod.pub.pem')).toString(),
    VLY_PRIVATE_KEY: process.env.VLY_PUBLIC_KEY || 'Please set the private key'
  }
}

export const privateKey = () => keys[process.env.NODE_ENV].VLY_PRIVATE_KEY
export const publicKey = () => keys[process.env.NODE_ENV].VLY_PUBLIC_KEY
