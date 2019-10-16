const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const InterestArchive = require('./interestArchive')
const { listInterests, updateInterest } = require('./interestArchive.controller')

module.exports = server => {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/interestsArchived',
    mongooseCrudify({
      Model: InterestArchive,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      actions: {
        list: listInterests,
        update: updateInterest
      },
      afterActions: [
        // this is the place to require user be authed.
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
