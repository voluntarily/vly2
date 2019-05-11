const mongooseCrudify = require('mongoose-crudify')
const sanitizeHtml = require('sanitize-html')
const { emailPerson } = require('./email/emailperson')

const helpers = require('../../services/helpers')
const Person = require('./person')

module.exports = function (server) {
  // Docs: https://github.com/ryo718/mongoose-crudify
  server.use(
    '/api/people',
    mongooseCrudify({
      Model: Person,
      selectFields: '-__v', // Hide '__v' property
      endResponseInAction: false,

      beforeActions: [
        { middlewares: [ensureSanitized], only: ['create', 'update'] }

      ],
      // actions: {}, // list (GET), create (POST), read (GET), update (PUT), delete (DELETE)
      afterActions: [
        { middlewares: [helpers.formatResponse] }
      ]
    })
  )

  server.get('/api/person/verify_email/:id', verifyEmailPerson)
}

function ensureSanitized (req, res, next) {
  // if user puts html in their inputs - remove stuff we don't want.
  // TODO - Also sanitize mongo $ commands. see mongo-sanitize
  if (!req.body) return next()
  const p = req.body

  p.name = sanitizeHtml(p.name)
  p.moniker = sanitizeHtml(p.moniker)
  p.email = sanitizeHtml(p.email)
  p.phone = sanitizeHtml(p.phone)
  p.gender = sanitizeHtml(p.gender)
  p.about = sanitizeHtml(p.about)
  req.body = p
  next()
}

function verifyEmailPerson (req, res) {
  console.log('verifyEmailPerson', req.params)
  if (!req.params.id) {
    res.status(400).send() // bad request
  }
  Person.findOne({ _id: req.params.id }).exec((err, person) => {
    if (err) {
      res.status(500).send(err)
      return
    }
    if (!person) {
      // not found
      res.status(404).send()
      return
    }

    emailPerson(person, 'verify', { token: 'ABCDEF123456' }).then(
      () => {
        res.status(200).end()
      }
    )
  })
}
