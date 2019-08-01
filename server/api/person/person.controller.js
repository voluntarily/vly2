const Person = require('./person')
const sanitizeHtml = require('sanitize-html')
const Role = require('../../services/authorize/role')
const pick = require('lodash.pick')
const { Ability } = require('@casl/ability')

/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */
function getPersonBy (req, res) {
console.log('FROM GET PERSON BY')
  console.log(req.path)
  const query = { [req.params.by]: req.params.value }
  Person.findOne(query).exec((_err, got) => {
    if (!got) { // person does not exist
      return res.status(404).send({ error: 'person not found' })
    }
    res.json(got)
  })
}

async function updatePersonDetail(req,res) {
  if(userAllowedToUpdate(req)){
    res.sendStatus(200)
  } else {
    res.sendStatus(403)
  }  
}

function userAllowedToUpdate(req){
  return userIsTheSamePerson(req) || userIsAdmin(req)
}

function userIsTheSamePerson(req){
  const userIDFromSession = req.session.me._id.toString()
  const { _id: userIDToUpdate } = req.body
  const idFromConditionRules = getIDConditionInRule(req.ability.rules)
  // console.log(idFromConditionRules.toString())
  return (userIDToUpdate === userIDFromSession) && (userIDFromSession === req.params._id) && (idFromConditionRules.toString() === userIDFromSession) 
}

function getIDConditionInRule(rawRules) {
  const ruleObjectKey = Object.keys(rawRules)
  
  const conditionSet = new Set()

  ruleObjectKey.forEach(rule => {
    const individualRules = rawRules[rule]
    const individualRulesKey = Object.keys(individualRules)
    if(individualRulesKey.includes('conditions')){
      const condition = individualRules['conditions']
      if(!conditionSet.has(condition)) conditionSet.add(condition)
    }
 })

 const conditionInvoleID = [...conditionSet].filter(element => element._id != null)
 return conditionInvoleID[0]._id // There should not be duplicate condition with different ID
}

function userIsAdmin(req){
  const userRoles = req.session.me.role.toString()
  return userRoles.includes(Role.ADMIN)
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


module.exports = {
  ensureSanitized,
  getPersonBy,
  updatePersonDetail
}
