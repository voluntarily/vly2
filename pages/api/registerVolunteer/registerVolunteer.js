import { Role } from '../../../server/services/authorize/role'

/* the registerVolunteer endpoint allows a person to
   register as volunteer

   /api/registerVolunteer?[org={org-slug}]

   org: slug name for an organisation.
    if no query provided then person just has role set to VOLUNTEER.
*/

export default async (req, res) => {
  try {
    if (!req.session.isAuthenticated) res.status(403).end()
    // check parameters
    // const { org } = req.query
    const me = req.session && req.session.me

    // We have a new volunteer
    if (!me.role.includes(Role.VOLUNTEER)) {
      me.role.push(Role.VOLUNTEER)
      await me.save()
    }
    res.json(me)
  } catch (e) {
    console.error('registerVolunteer:', e)
    res.status(500).end()
  }
}
