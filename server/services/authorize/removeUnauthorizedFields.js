const pick = require('lodash.pick')
const { defaultConvertRequestToAction } = require('../../middleware/authorize/authorizeRequest')

const removeUnauthorizedFields = (Schema) => (req, res, next) => {
  const action = defaultConvertRequestToAction(req)
  const authorizedFields = Schema.accessibleFieldsBy(req.ability, action)
  if (Array.isArray(req.crudify.result) && req.crudify.result.length === 1) {
    req.crudify.result = req.crudify.result[0]
  }
  if (Array.isArray(req.crudify.result)) {
    req.crudify.result = req.crudify.result.map(eachResult => pick(eachResult, authorizedFields))
  }
  next()
}

module.exports = removeUnauthorizedFields
