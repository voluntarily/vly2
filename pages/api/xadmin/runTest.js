import fetch from 'isomorphic-fetch'
import { Role } from '../../../server/services/authorize/role.js'

export default async (req, res) => {
  // person must be authenticated administrator
  if (!req.session ||
    !req.session.isAuthenticated ||
    !req.session.me.role.includes(Role.ADMIN)) {
    return res.status(403).end()
  }

  const e2eTestUrl = 'https://ci.getskills.co.nz/job/voluntarily-alpha-auto-nimbal/buildWithParameters?token=11807fa12c68f4d8651de26ae1cf54baea&parameters=@signin'
  try {
    await fetch(e2eTestUrl)
    return res.json({ status: 'OK' })
  } catch (e) {
    console.error('problem with end to end test:', e)
    return res.status(400).json(e)
  }
}
