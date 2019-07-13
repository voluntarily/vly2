const { Action } = require('../../services/abilities/ability.constants')
const { SchemaName, OpportunityRoutes } = require('./opportunity.constants')
const Opportunity = require('./opportunity')
const pick = require('lodash.pick')

const convertRequestToAction = (req) => {
  switch (req.method) {
    case 'GET':
      return req.route.path === OpportunityRoutes[Action.READ] ? Action.READ : Action.LIST
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

const authorizeOpportunityActions = (req, res, next) => {
  const action = convertRequestToAction(req)
  const authorized = req.ability.can(action, SchemaName)
  if (authorized) {
    next()
  } else {
    res.status(403).end()
  }
}

const authorizeOpportunityFields = (req, res, next) => {
  var authorizedFields = Opportunity.accessibleFieldsBy(req.ability)
  res.data = Array.isArray(res.body)
    ? res.body.map(opp => pick(opp, authorizedFields))
    : pick(res.body, authorizedFields)
  next()
}

module.exports = {
  authorizeOpportunityActions,
  authorizeOpportunityFields
}
