/* Generate a token that allows a person to sign in
  and carry out an action
*/

import { privateKey, publicKey } from './keys'
import jwt from 'jsonwebtoken'
const { config } = require('../../config/config')

// expecting content to include
// {
//   landingUrl - local path where click should arrive
//   redirectUrl - location to goto once action completed
//   data - and local object data passed to action
//   action - action to carry out e.g. registerOrgMember, must be known
//   expiresIn: '1h'
// }
export const makeURLToken = (content) => {
  // create token
  const options = {
    algorithm: 'RS256',
    expiresIn: content.expiresIn || '1h'
  }
  var token = jwt.sign(content, privateKey(), options)

  return `${config.appUrl}${content.landingUrl}?token=${token}`
}

// will throw if jwt verify fails, caller must work out what to do next)
export const handleURLToken = (token, actions) => {
  const options = {
    algorithm: 'RS256'
  }
  const content = jwt.verify(token, publicKey(), options)
  // check the action
  if (Object.prototype.hasOwnProperty.call(actions, content.action)) {
    actions[content.action](content.data)
    return content
  }
  return false
}
