const Person = require('./person')
const sanitizeHtml = require('sanitize-html')
const Action = require('../../services/abilities/ability.constants')

/* find a single person by searching for a key field.
This is a convenience function usually used to call
/api/person/by/email/person@example.com  but can be used for other fields
*/
function getPersonBy (req, res) {
  let query
  if (req.params.by) {
    query = { [req.params.by]: req.params.value }
  } else {
    query = req.params
  }

  Person.findOne(query).populate('tags').exec((_err, got) => {
    if (!got) { // person does not exist
      return res.status(404).send({ error: 'person not found' })
    }
    res.json(got)
  })
}

/* return a list of people matching the search criteria
  if no params given then show all permitted.
*/
function listPeople (req, res) {
  let query = {}
  let sort = 'nickname'
  let select = ''
  try {
    query = req.query.q ? JSON.parse(req.query.q) : {}
    sort = req.query.s ? JSON.parse(req.query.s) : sort
    select = req.query.p ? JSON.parse(req.query.p) : {}

    Person.find(query, select).populate('tags').sort(sort)
      .then(got => {
        res.json(got)
      })
  } catch (e) {
    console.error('Bad request', req.query)
    return res.status(400).send(e)
  }
}

async function updatePersonDetail (req, res, next) {
  const { ability: userAbility } = req
  const userID = req.body._id
  let resultUpdate
  try {
    resultUpdate = await Person.accessibleBy(userAbility, Action.UPDATE).updateOne({ _id: userID }, req.body)
  } catch (e) {
    return res.sendStatus(400) // 400 error for any bad request body. This also prevent error to propagate and crash server
  }
  if (resultUpdate.n === 0) {
    return res.sendStatus(404)
  }
  req.crudify.result = req.body
  next()
}

function ensureSanitized (req, res, next) {
  const szAbout = {
    allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe'],
    allowedAttributes: {
      a: ['href'],
      img: ['src']
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

module.exports = {
  ensureSanitized,
  listPeople,
  getPersonBy,
  updatePersonDetail
}
