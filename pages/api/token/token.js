const { handleURLToken } = require('../../../lib/sec/actiontoken')

/* the doToken endpoint handles a URL token request
  and then forwards to the requested page.

*/

const handleToken = async (req, res, actionTable) => {
  const { token } = req.query
  // request must have a ?token=
  if (!token) {
    return res.status(403).end()
  }

  // if user is not authenticated then get them in.
  if (!req.session.isAuthenticated) {
    if (req.session.user && !req.session.user.email_verified) {
      // if user has signed in but is invalid then tell them
      return res.redirect('/unverified')
    } else {
      // user has not signed in
      return res.redirect(`/auth/sign-thru?redirect=${req.originalUrl}`)
    }
  }
  try {
    const payload = await handleURLToken(token, actionTable)
    return res.redirect(payload.redirectUrl)
  } catch (e) {
    console.error('handleToken:', e)
    res.status(404).send(e.message)
  }
}

const testActionTable = {
  log: props => console.log('log', props)
}

module.exports = (req, res) => handleToken(req, res, testActionTable)
module.exports.handleToken = handleToken
