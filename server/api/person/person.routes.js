const mongooseCrudify = require('mongoose-crudify')

const helpers = require('../../services/helpers')
const Person = require('./person')
const { ensureSanitized, getPersonBy } = require('./person.controller')
const { SchemaName } = require('./person.constants')
const { authorizeActions } = require('../../middleware/authorize/authorizeRequest')

module.exports = function (server) {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/people',
    mongooseCrudify({
      Model: Person,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,
      beforeActions: [
        { middlewares: [ 
          (req,res, next) => {
            console.log('\nBEFORE MONGOOSE CRUDIFY ACTION')
            console.log('Is there cookie object in header ? ', req.headers.cookie != null)
            console.log('Is there session object in req ? ', req.session != null)
            console.log('Is there authorization object in header ? ', req.headers.authorization != null)

            console.log('Req path is ', req.path)
            next()
          },
          authorizeActions(SchemaName), ensureSanitized ] }
      ],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      afterActions: [
        { middlewares: [ helpers.formatResponse] }
      ]
    })
  )

  server.get('/api/person/by/:by/:value', getPersonBy)
}
