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
          (req, res, next) => {
            console.log('In person middleware before action');
            console.log(req.session);
            console.log(req.cookies);
            console.log('\n\n')
            next();
          } ,
          authorizeActions(SchemaName), 
          ensureSanitized ] 
        }

      ],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      afterActions: [
        { middlewares: [
            (req, res, next) => {
              console.log('After action in person routes the session has a value of ')
              console.log(req.session)
              next()
            },
            helpers.formatResponse]
        }
      ]
    })
  )

  server.get('/api/person/by/:by/:value', getPersonBy)
}
