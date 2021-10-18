
const config = require('../../../config/serverConfig').config
const keys = require('../../../lib/sec/keys')

/* prints the current config file and env vars. if signed in as admin
*/
export const Config = (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  if (!req.ability.can('manage', 'Organisation')) {
    return res.status(401).json({ error: 'Admin Authorisation required' })
  }
  config.keys = { priv: keys.privateKey(), pub: keys.publicKey() }
  res.status(200).json(config)
}

export default Config
