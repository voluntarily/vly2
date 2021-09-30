import jwksClient from 'jwks-rsa'
import jwt from 'jsonwebtoken'

import config from '../../../config/clientConfig.js'

const client = jwksClient({
  strictSsl: true, // Default value
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10, // Default value
  jwksUri: `https://${config.auth.AUTH0_CLIENT_DOMAIN}/.well-known/jwks.json`,
  requestHeaders: {}, // Optional
  requestAgentOptions: {} // Optional
})

export const getSigningKey = (header, callback) => {
  if (process.env.NODE_ENV === 'test') {
    callback(null, 'secret')
  } else if (process.env.NODE_ENV === 'development' && header.kid === 'dev') {
    // we are using a dev signed key for testing purposes
    callback(null, 'dev')
  } else {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) { console.log(err); callback(err, null) }
      const signingKey = key.publicKey || key.rsaPublicKey
      callback(null, signingKey)
    })
  }
}

export const jwtVerify = idToken => {
  return new Promise((resolve, reject) => {
    jwt.verify(idToken, getSigningKey, {}, (err, decoded) => {
      if (err) { return reject(err) }
      resolve(decoded)
    })
  })
}


// const secretCallback = jwksRsa.expressJwtSecret({
//   cache: true,
//   rateLimit: true,
//   jwksRequestsPerMinute: 5,
//   jwksUri:
// })
