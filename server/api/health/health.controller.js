/**
 * Get system health and ask questions
 */
const config = require('../../../config/config').config

// check a bunch of things here like whether the db is connected and responding.
// any depended upon api services
const getHealth = (req, res) => {
  const result = {
    message: `${config.appName} (${process.env.REVISION || 'local_build'}) running on ${config.appUrl}/ Be Awesome`,
    health: 'OK',
    params: req.params,
    query: req.query,
    app_url: process.env.APP_URL,
    config: req.params.param1 === 'config' && config
  }
  return res.status(200).json(result)
}

module.exports = getHealth
