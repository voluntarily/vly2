const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const Tag = require('./tag')
const { listTags } = require('./tag.controller.js')

module.exports = server => {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/tags',
    mongooseCrudify({
      Model: Tag,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      // beforeActions: [],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: listTags
      },
      afterActions: [
        // this is the place to require user be authed.
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
