import { makeURLToken } from '../../../lib/sec/actiontoken'

/* the api/doToken/getToken endpoint returns a valid token
  required to carry out the desired action.
e.g https://localhost:3122/api/token/mintToken?action=log&data="hello world"
*/

export default async (req, res) => {
  if (!req.session.isAuthenticated) res.status(403).end()

  try {
    const payload = req.query
    payload.token = makeURLToken(payload)
    return res.json(payload)
  } catch (e) {
    console.log('doToken:', e)
    res.status(500).end()
  }
}
