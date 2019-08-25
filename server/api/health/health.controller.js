/**
 * Get system health and ask questions
 */
const config = require('../../../config/config').config

/* The /api/health endpoint returns information about the health of the system
  it is the endpoint to call in docker or AWS container health monitoring
  if it returns 200 the server is operating

  There are also some other useful features
  /api/health/<p1>/<p2>?query - prints the current params and query parameters
  /api/health/log?msg="message" - allows you to push a message into the logfile.
    This is useful when you want to see which instance you are talking to
  /api/health/config - prints the current config file and env vars.
*/
const getHealth = (req, res) => {
  if (req.param1 === 'log') {
    console.log(req.query.msg)
  }
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
