import { addPersonalGoalGroup } from '../../../server/api/personalGoal/personalGoal.lib'

/* The /api/xadmin/ endpoint provides some utility calls that
  /api/xadmin/assignPersonalGoals?group="name" - loads the given group into the signed in user
*/
export const assignPersonalGoals = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  // person must be authenticated administrator
  if (!req.session || !req.session.isAuthenticated) {
    return res.status(403).end()
  }
  if (!req.query.group) {
    // bad request if group is missing
    return res.status(400).json({ error: 'group expected' })
  }
  try {
    await addPersonalGoalGroup(req.query.group, req.session.me._id.toString())
    return res.json({ status: 'OK' })
  } catch (e) {
    console.error('Error in assignPersonalGoals', e)
    return res.status(400).json(e)
  }
}
export default assignPersonalGoals
