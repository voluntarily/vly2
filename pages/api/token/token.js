import { handleURLToken } from '../../../lib/sec/actiontoken'

/* the doToken endpoint handles a URL token request
  and then forwards to the requested page.

*/
const actionTable = {
  log: props => console.log('log', props)
}

export default async (req, res) => {
  console.log('token', req.query)
  const { token } = req.query
  // request must have a ?token=
  if (!token) {
    return res.status(403).end()
  }
  // if user is not authenticated then get them in.
  if (!req.session.isAuthenticated) {
    console.log('signing thru to', req.originalUrl)
    res.redirect(`/auth/sign-thru?redirect=${req.originalUrl}`)
  }
  try {
    const payload = handleURLToken(token, actionTable)
    res.redirect(payload.redirectUrl)
  } catch (e) {
    console.log('doToken:', e)
    res.status(500).end()
  }
}
