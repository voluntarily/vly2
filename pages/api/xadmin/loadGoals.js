import { Role } from '../../../server/services/authorize/role.js'
import { loadGoals } from '../../../server/api/goal/loadGoals'
/* The /api/admin endpoint provides some utility calls that
  /api/admin/initGoals - loads some initial goals from a designated file
*/
export const LoadGoals = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  // person must be authenticated administrator
  if (!req.session ||
    !req.session.isAuthenticated ||
    !req.session.me.role.includes(Role.ADMIN)) {
    return res.status(403).end()
  }
  try {
    loadGoals()
    return res.json({ status: 'OK' })
  } catch (e) {
    console.error('problem with Load Goals', e)
    return res.status(400).json(e)
  }
}

export default LoadGoals
