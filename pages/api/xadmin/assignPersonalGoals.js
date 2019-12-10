import { addPersonalGoalGroup } from '../../../server/api/personalGoal/personalGoal.lib'

/* The /api/xadmin/ endpoint provides some utility calls that
  /api/xadmin/assignPersonalGoals?category="name" - loads the given category into the signed in user
*/
export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  // person must be authenticated administrator
  if (!req.session || !req.session.isAuthenticated) {
    return res.status(403).end()
  }
  if (!req.query.category) {
    // bad request if category is missing
    return res.status(400).json({ error: 'category expected' })
  }
  try {
    await addPersonalGoalGroup(req.query.category, req.session.me._id)
    return res.json({ status: 'OK' })
  } catch (e) {
    console.error('Error in assignPersonalGoals', e)
    return res.status(400).json(e)
  }
}
