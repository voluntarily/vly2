const mongooseCrudify = require('@voluntarily/mongoose-crudify')
const helpers = require('../../services/helpers')
const { InterestArchive } = require('./interest')
const { listInterestArchives, updateInterestArchive, getInterestArchive } = require('../interest/interest.controller')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { InterestArchiveSchemaName } = require('./interest.constants')

module.exports = server => {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/interestArchives',
    mongooseCrudify({
      Model: InterestArchive,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [{
        middlewares: [authorizeActions(InterestArchiveSchemaName)]
      }],
      actions: {
        list: listInterestArchives,
        read: getInterestArchive,
        update: updateInterestArchive
      },
      afterActions: [
        // this is the place to require user be authed.
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
