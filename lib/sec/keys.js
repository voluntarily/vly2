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
    VLY_PRIVATE_KEY: process.env.VLY_PRIVATE_KEY || 'Please set the private key',
    VLY_PUBLIC_KEY: fs.readFileSync(path.resolve(process.cwd(), 'lib/sec/prod.pub.pem')).toString()
  },

  RAYGUN_EXPRESS_SERVER_API_KEY: process.env.RAYGUN_EXPRESS_SERVER_API_KEY,
  RAYGUN_REACT_CLIENT_API_KEY: process.env.RAYGUN_REACT_CLIENT_API_KEY
}

const privateKey = () => keys[process.env.NODE_ENV].VLY_PRIVATE_KEY
const publicKey = () => keys[process.env.NODE_ENV].VLY_PUBLIC_KEY

const raygunExpressServerAPIKey = () => keys[process.env.NODE_ENV].RAYGUN_EXPRESS_SERVER_API_KEY
const raygunReactClientAPIKey = () => keys[process.env.NODE_ENV].RAYGUN_REACT_CLIENT_API_KEY

module.exports = {
  privateKey,
  publicKey,
  raygunExpressServerAPIKey,
  raygunReactClientAPIKey
}
