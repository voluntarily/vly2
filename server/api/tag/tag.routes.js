const mongooseCrudify = require('@voluntarily/mongoose-crudify')
const helpers = require('../../services/helpers')
const Tag = require('./tag')
const { listTags } = require('./tag.controller.js')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { SchemaName } = require('./tag.constants')

module.exports = server => {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/tags',
    mongooseCrudify({
      Model: Tag,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [{ middlewares: [authorizeActions(SchemaName)] }],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: listTags
      },
      afterActions: [
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
