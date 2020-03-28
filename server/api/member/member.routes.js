const mongooseCrudify = require('mongoose-crudify')
const helpers = require('../../services/helpers')
const Member = require('./member')
const { listMembers, updateMember, createMember, getMember } = require('./member.controller')
const { findMyOrg, findMyPerson } = require('./findMy')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')
const { SchemaName } = require('./member.constants')

module.exports = server => {
  server.use('/my/org/:role', findMyOrg)
  server.use('/my/org', findMyOrg)
  server.use('/my/person', findMyPerson)

  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/members',
    mongooseCrudify({
      Model: Member,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [{
        middlewares: [authorizeActions(SchemaName)]
      }],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      actions: {
        list: listMembers,
        read: getMember,
        update: updateMember,
        create: createMember
      },
      afterActions: [
        // this is the place to require user be authed.
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )
}
