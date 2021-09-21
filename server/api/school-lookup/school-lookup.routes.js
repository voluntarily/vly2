const mongooseCrudify = require('@voluntarily/mongoose-crudify')
const helpers = require('../../services/helpers')
const SchoolLookUp = require('./school-lookup')
const { getSchools } = require('./school-lookup.controller')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { SchemaName } = require('./school-lookup.constants')

module.exports = function (server) {
  server.use(
    '/api/schools',
    mongooseCrudify({
      Model: SchoolLookUp,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [{
        middlewares: [authorizeActions(SchemaName)]
      }],
      actions: {
        list: getSchools
      },
      afterActions: [
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
