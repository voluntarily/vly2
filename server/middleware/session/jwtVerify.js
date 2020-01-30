const { config } = require('../../../config/config')
const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

const client = jwksClient({
  strictSsl: true, // Default value
  jwksUri: `https://${config.auth.AUTH0_CLIENT_DOMAIN}/.well-known/jwks.json`,
  requestHeaders: {}, // Optional
  requestAgentOptions: {} // Optional
})

const getSigningKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) { console.log(err); callback(err, null) }
    const signingKey = key.publicKey || key.rsaPublicKey
    callback(null, signingKey)
  })
}
const jwtVerify = idToken => {
  return new Promise((resolve, reject) => {
    jwt.verify(idToken, getSigningKey, {}, (err, decoded) => {
      if (err) { return reject(err) }
      resolve(decoded)
    })
  })
}
module.exports = {
  jwtVerify,
  getSigningKey
}
// const secretCallback = jwksRsa.expressJwtSecret({
//   cache: true,
//   rateLimit: true,
//   jwksRequestsPerMinute: 5,
//   jwksUri:
// })
