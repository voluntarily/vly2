const pick = require('lodash.pick')

const removeUnauthorizedFields = (responseData, Schema, ability, action) => {
  const authorizedFields = Schema.accessibleFieldsBy(ability, action)
  return Array.isArray(responseData)
    ? responseData.map(item => pick(item, authorizedFields))
    : pick(responseData, authorizedFields)
}

module.exports = removeUnauthorizedFields
