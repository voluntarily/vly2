const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const InterestArchive = require('./interestArchive')
const { listInterests, updateInterest, getInterest } = require('./interestArchive.controller')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { SchemaName } = require('./interestArchive.constants')

module.exports = server => {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/interestsArchived',
    mongooseCrudify({
      Model: InterestArchive,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [{
        middlewares: [authorizeActions(SchemaName)]
      }],
      actions: {
        list: listInterests,
        read: getInterest,
        update: updateInterest
      },
      afterActions: [
        // this is the place to require user be authed.
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
