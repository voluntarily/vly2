const Person = require('./person')
const sanitizeHtml = require('sanitize-html')
const { emailPerson } = require('./email/emailperson')

/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */
function getPersonBy (req, res) {
  console.log('getPersonBy', req.params)
  const query = { [req.params.by]: req.params.value }
  Person.findOne(query).exec((err, got) => {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }
    if (!got) {
      // person does not exist
      return res.status(404).send({ error: 'person not found' })
    }
    //console.log('getPersonBy ', got)
    res.json(got)
  })
}

function ensureSanitized (req, res, next) {
  // if user puts html in their inputs - remove stuff we don't want.
  // TODO - Also sanitize mongo $ commands. see mongo-sanitize
  if (!req.body) return next()
  const p = req.body

  p.name = sanitizeHtml(p.name)
  p.nickname = sanitizeHtml(p.nickname)
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

module.exports = {
  verifyEmailPerson,
  ensureSanitized,
  getPersonBy
}
