import { Action } from '../../services/abilities/ability.constants'

const defaultConvertRequestToAction = (req) => {
  switch (req.method) {
    case 'GET':
      return (req.route && req.route.path === '/') ? Action.LIST : Action.READ
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

const authorizeActions = (subject, convertRequestToAction = defaultConvertRequestToAction) => (req, res, next) => {
  const action = convertRequestToAction(req)
  const authorized = req.ability.can(action, subject)
  // console.log('authorizeActions', subject, action, authorized)
  if (authorized) {
    next()
  } else {
    // console.log(`Auth cannot ${action} ${subject}`)
    res.status(403).json({ error: `Auth cannot ${action} ${subject}` })
  }
}

export default {
  authorizeActions,
  defaultConvertRequestToAction
}
