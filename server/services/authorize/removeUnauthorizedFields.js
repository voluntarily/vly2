const pick = require('lodash.pick')
const { defaultConvertRequestToAction } = require('../../middleware/authorize/authorizeRequest')

const removeUnauthorizedFields = (Schema) => (req, res, next) => {
  const action = defaultConvertRequestToAction(req)
  const fieldCanRead = Schema.accessibleFieldsBy(req.ability, action)

  if (Array.isArray(req.crudify.result)) {
    req.crudify.result = req.crudify.result.map(eachResult => pickFrom(eachResult, fieldCanRead))
  } else if (req.session.me._id.toString() !== req.crudify.result._id.toString()) {
    req.crudify.result = pickFrom(req.crudify.result, fieldCanRead)
  }
  next()
}

function pickFrom (dbObject, fieldCanRead) {
  return pick(dbObject, fieldCanRead)
}

module.exports = removeUnauthorizedFields
