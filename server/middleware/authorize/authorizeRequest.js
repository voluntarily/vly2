const { Action } = require('../../services/abilities/ability.constants')
const pick = require('lodash.pick')

const defaultConvertRequestToAction = (req) => {
  switch (req.method) {
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
  const action = convertRequestToAction === undefined ? defaultConvertRequestToAction(req) : convertRequestToAction(req)
  const authorized = req.ability.can(action, subject)
  console.log('Calling from the authorized request')
  console.log('The request has session value of ', req.session)
  console.log('The request has cookie of ', req.cookies)
  if (authorized) {
    next()
  } else {
    res.status(403).end()
  }
}

const authorizeFields = (Schema) => (req, res, next) => {
  var authorizedFields = Schema.accessibleFieldsBy(req.ability)
  res.data = Array.isArray(res.body)
    ? res.body.map(item => pick(item, authorizedFields))
    : pick(res.body, authorizedFields)
  next()
}

module.exports = {
  authorizeActions,
  authorizeFields
}
