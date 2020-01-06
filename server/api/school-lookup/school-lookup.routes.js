const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const SchoolLookUp = require('./school-lookup')
const { getSchools } = require('./school-lookup.controller')

module.exports = function (server) {
  server.use(
    '/api/schools',
    mongooseCrudify({
      Model: SchoolLookUp,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      actions: {
        list: getSchools
      },
      afterActions: [
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
