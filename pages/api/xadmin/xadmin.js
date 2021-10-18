import { Role } from '../../../server/services/authorize/role.js'
const config = require('../../../config/clientConfig').config
/* The /api/admin endpoint provides some utility calls that
can be used to setup a new database.
  all calls check for authorised user with admin status.
  /api/admin/init - checks database is empty and loads in an initial entities

  /api/admin/loadGoals - loads some initial goals from a designated file
  /api/admin/testOps - loads a set of test people and opportunities
  /api/admin/testOrgs - loads a set of test people and opportunities
*/
export const setAdmin = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  // person must be authenticated administrator
  if (!req.session ||
    !req.session.isAuthenticated ||
    !req.session.me.role.includes(Role.ADMIN)) {
    return res.status(403).end()
  }

  const result = {
    message: `${config.appName} (${process.env.REVISION || 'local_build'}) running on ${config.appUrl} ${config.env} / Be Awesome`,
    health: 'You are an authenticated Administrator',
    query: req.query,
    method: req.method,
    app_url: process.env.APP_URL
  }
  res.send(result)
}
export default setAdmin
