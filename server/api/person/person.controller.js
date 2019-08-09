const Person = require('./person')
const sanitizeHtml = require('sanitize-html')

/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */
function getPersonBy (req, res) {
  const query = { [req.params.by]: req.params.value }
  Person.findOne(query).exec((_err, got) => {
    if (!got) { // person does not exist
      return res.status(404).send({ error: 'person not found' })
    }
    // console.log('getPersonBy ', got)
    res.json(got)
  })
}

function ensureSanitized (req, res, next) {
  const szAbout = {
    allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe' ],
    allowedAttributes: {
      a: [ 'href' ],
      img: [ 'src' ]
    },
    allowedIframeHostnames: ['www.youtube.com']
  }

  // if user puts html in their inputs - remove stuff we don't want.
  // TODO - Also sanitize mongo $ commands. see mongo-sanitize
  const p = req.body
  p.name = sanitizeHtml(p.name)
  p.nickname = sanitizeHtml(p.nickname)
  p.phone = p.phone && sanitizeHtml(p.phone)
  p.gender = p.gender && sanitizeHtml(p.gender)
  p.about = p.about && sanitizeHtml(p.about, szAbout)
  req.body = p
  next()
}

// HOW TO EMAIL A PERSON
// const { emailPerson } = require('./email/emailperson')
// function verifyEmailPerson (req, res) {
//   console.log('verifyEmailPerson', req.params)
//   if (!req.params.id) {
//     res.status(400).send() // bad request
//   }
//   Person.findOne({ _id: req.params.id }).exec((err, person) => {
//     if (err) {
//       res.status(500).send(err)
//       return
//     }
//     if (!person) {
//       // not found
//       res.status(404).send()
//       return
//     }

//     emailPerson(person, 'verify', { token: 'ABCDEF123456' }).then(
//       () => {
//         res.status(200).end()
//       }
//     )
//   })
// }

module.exports = {
  ensureSanitized,
  getPersonBy
}
