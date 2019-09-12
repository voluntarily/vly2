const { config } = require('../../../config/config')

const requestorNotAdmind = (ability) => {
  const hasAbility = ability != null
  return hasAbility
}

const requestValid = ({ ability, session }) => {
  if (!session.isAuthenticated || requestorNotAdmind(ability)) {
    return false
  }
  return true
}

const issueNewBadge = async (req, res) => {
  if (!requestValid(req)) return res.sendStatus(403)
  const { BADGER_PASSWORD, BADGER_USERNAME } = config
  if (!BADGER_PASSWORD && !BADGER_USERNAME) {
    return res.json({ 'message': 'Internal server error' }).status(500)
  }

  return res.json({ 'Message': 'The request is ok' })
}

module.exports = {
  issueNewBadge
}
