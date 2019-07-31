const { Action } = require('../../services/abilities/ability.constants')

const defaultConvertRequestToAction = (method) => {
  switch (method) {
    case 'GET':
      return Action.READ
    case 'POST':
      return Action.CREATE
    case 'PUT':
      return Action.UPDATE
    case 'DELETE':
      return Action.DELETE
    default:
      return Action.READ
  }
}

const authorizeActions = (subject, convertRequestToAction) => (req, res, next) => {
  const action = convertRequestToAction === undefined ? defaultConvertRequestToAction(req.method) : convertRequestToAction(req)
  const authorized = req.ability.can(action, subject)
  if (authorized) {
    next()
  } else {
    res.status(403).end()
  }
}

module.exports = {
  authorizeActions,
  defaultConvertRequestToAction
}
