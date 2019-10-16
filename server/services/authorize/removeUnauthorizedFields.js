const pick = require('lodash.pick')
const { defaultConvertRequestToAction } = require('../../middleware/authorize/authorizeRequest')

const removeUnauthorizedFields = (Schema) => (req, res, next) => {
  const action = defaultConvertRequestToAction(req)
  const authorizedFields = Schema.accessibleFieldsBy(req.ability, action)
  Array.isArray(req.crudify.result)
    ? req.crudify.result = req.crudify.result.map(eachResult => pick(eachResult, authorizedFields))
    : req.crudify.result = req.crudify.result._id.toString() === req.sesion.me._id.toString() ? { ...req.crudify.result } : pick(req.crudify.result, authorizedFields)
  next()
}

module.exports = removeUnauthorizedFields
