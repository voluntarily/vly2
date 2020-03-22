const pick = require('lodash.pick')
const { defaultConvertRequestToAction } = require('../../middleware/authorize/authorizeRequest')

const removeUnauthorizedFields = (Schema, convertRequestToAction = defaultConvertRequestToAction) => (req, res, next) => {
  const action = convertRequestToAction(req)
  const fieldCanRead = Schema.accessibleFieldsBy(req.ability, action)

  if (Array.isArray(req.crudify.result)) {
    req.crudify.result = req.crudify.result.map(eachResult => pickFrom(eachResult, fieldCanRead))
  } else {
    req.crudify.result = pickFrom(req.crudify.result, fieldCanRead)
  }

  next()
}

function pickFrom (dbObject, fieldCanRead) {
  return pick(dbObject, fieldCanRead)
}

module.exports = removeUnauthorizedFields
