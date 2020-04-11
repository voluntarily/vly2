
const config = require('../../../config/serverConfig').config

/* prints the current config file and env vars. if signed in as admin
*/
export default (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  // if (!req.ability.can('manage', 'Organisation')) {
  //   return res.status(401).json('Authorisation required')
  // }
  res.status(200).json(config)
}
