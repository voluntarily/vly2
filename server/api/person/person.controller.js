const Person = require('./person')
const sanitizeHtml = require('sanitize-html')
const { Action } = require('../../services/abilities/ability.constants')
const { getPersonRoles } = require('../member/member.lib')
const { Role } = require('../../services/authorize/role')
const { supportedLanguages } = require('../../../lang/lang')
const { websiteRegex } = require('./person.validation')
const mongoose = require('mongoose')
const { PersonPublicFields, PersonFriendFields } = require('./person.constants')
const { mapValues, keyBy } = require('lodash')
const { Interest } = require('../interest/interest')
const Opportunity = require('../opportunity/opportunity')
const { InterestStatus } = require('../interest/interest.constants')

/* find a single person by searching for a key field.
This is a convenience function usually used to call
*/
async function getPerson (req, res, next) {
  const query = req.params

  const me = req && req.session && req.session.me
  if (!me) {
    return res.sendStatus(401)
  }

  const personId = req.params._id
  if (!personId) {
    return res.status(400).send('Missing person identifier')
  }

  const isSelf = me._id && personId === me._id.toString()
  // const isPersonInMyOrg = async () => {
  //   const myOrgs = (await Member.find({ person: me._id })).map(member => member.organisation.toString())
  //   const personOrgs = (await Member.find({ person: personId })).map(member => member.organisation.toString())

  //   return !!myOrgs.find(myOrg => personOrgs.includes(myOrg))
  // }

  const isPersonInvitedToMyOpportunities = async () => {
    const myOps = await Opportunity.find({ requestor: me._id })
    return !!(await Interest.findOne({
      opportunity: { $in: myOps },
      status: { $ne: InterestStatus.DECLINED },
      person: personId
    }))
  }

  const personalFriend = (me.role &&
    (
      me.role.includes(Role.ADMIN) ||
      me.role.includes(Role.SUPPORT) ||
      // (await isPersonInMyOrg()) ||
      (await isPersonInvitedToMyOpportunities())
    )) ||
    isSelf
  const fields = (personalFriend) ? PersonFriendFields : PersonPublicFields

  Person
    .accessibleBy(req.ability, Action.READ)
    .findOne(query, mapValues(keyBy(fields), field => 1))
    .exec(async (_err, person) => {
      if (person) { // note if person does not exist middleware will already have 404d the result
        await getPersonRoles(person)
      }
      req.crudify = { result: person }
      return next()
    })
}

/* return a list of people matching the search criteria
  if no params given then show all permitted.
*/
function listPeople (req, res, next) {
  let query = {}
  let sort = 'nickname'
  let select = ''
  try {
    query = req.query.q ? JSON.parse(req.query.q) : {}
    sort = req.query.s ? JSON.parse(req.query.s) : sort
    select = req.query.p ? JSON.parse(req.query.p) : {}

    Person.find(query, select).sort(sort)
      .then(got => {
        const dbRecord = normalizeDBRecordObject(got)
        req.crudify = { result: dbRecord }
        return next()
      })
  } catch (e) {
    return res.status(400).send(e)
  }
}

const isProd = process.env.NODE_ENV === 'production'

async function updatePersonDetail (req, res, next) {
  const { ability: userAbility, body: person } = req

  const me = req && req.session && req.session.me
  if (!me) {
    return res.sendStatus(401)
  }

  const personId = req.params._id
  if (!personId || !person) {
    return res.status(400).send('Missing person identifier')
  }

  const currentPerson = await Person.findById(personId).lean().exec()
  if (!currentPerson) {
    return res.sendStatus(404)
  }

  const updatingSelf = me._id && personId === me._id.toString()

  // ADMIN, SUPPORT, ORG_ADMIN or the owner of the person record is allowed to update it, otherwise forbidden
  const allowed = (me.role &&
                  (
                    me.role.includes(Role.ADMIN) ||
                    me.role.includes(Role.SUPPORT) ||
                    me.role.includes(Role.ORG_ADMIN)
                  )) ||
                  updatingSelf

  if (!allowed) {
    return res.status(403).send('You do not have the required role to update this person')
  }

  // If we are attempting to change the role field
  if (person.role) {
    // Only an ADMIN can update the role field to include ADMIN
    if (person.role.includes(Role.ADMIN) && !me.role.includes(Role.ADMIN)) {
      return res.status(403).send('You do not have the required role to change the \'role\' field')
    }

    // Only ADMIN can update the role field to include SUPPORT
    if (person.role.includes(Role.SUPPORT) && !me.role.includes(Role.ADMIN)) {
      return res.status(403).send('You do not have the required role to change the \'role\' field')
    }
  }

  // Only a subset of the Role enum can be set via the API. Some value are computed and set such as ORG_ADMIN.
  const applicableRoles = [Role.ACTIVITY_PROVIDER, Role.ADMIN, Role.OPPORTUNITY_PROVIDER, Role.RESOURCE_PROVIDER, Role.SUPPORT, Role.VOLUNTEER]
  if (person.role && person.role.find(role => !applicableRoles.includes(role))) {
    return res.status(400).send('You have specified an invalid role value')
  }

  // Only ADMIN can change the email field
  if (person.email && !me.role.includes(Role.ADMIN)) {
    return res.status(403).send('You do not have the required role to change the \'email\' field')
  }

  // Cannot change createdAt
  if (Object.keys(person).includes('createdAt')) {
    return res.status(403).send('The createdAt field cannot be changed')
  }

  // Must be a valid language
  if (Object.keys(person).includes('language') && !supportedLanguages.includes(person.language)) {
    return res.status(400).send('You have specified an invalid language value')
  }

  // Website string validation
  if (Object.keys(person).includes('website')) {
    if (!(person.website || '').match(websiteRegex)) {
      return res.status(400).send('The \'website\' field does not match the validation rule')
    }
  }

  // Populate the city and region field of person address into the locations array
  if (person.address) {
    if (Object.keys(person.address).includes('city') || Object.keys(person.address).includes('region')) {
      // remove duplicated value
      let locationsFromPersonAddress = [...new Set([person.address.city, person.address.region])]
      if (locationsFromPersonAddress.length > 0) {
        locationsFromPersonAddress = locationsFromPersonAddress.filter(val => val) // remove null value
        person.locations = person.locations.concat(locationsFromPersonAddress)
      }
    }
  }

  if (isProd) { delete person.role } // cannot save role - its virtual
  let resultUpdate
  try {
    resultUpdate = await Person.accessibleBy(userAbility, Action.UPDATE).updateOne({ _id: personId }, person)
  } catch (e) {
    return res.sendStatus(400) // 400 error for any bad request body. This also prevent error to propagate and crash server
  }
  if (resultUpdate.n === 0) {
    return res.sendStatus(404)
  }
  // return the updated person - lean'ed to simple object for result
  const updatedPerson = await Person.findById(personId).lean().exec()
  await getPersonRoles(updatedPerson)
  req.crudify.result = updatedPerson
  next()
}

async function deletePerson (req, res, next) {
  const me = req && req.session && req.session.me
  if (!me) {
    return res.sendStatus(401)
  }

  const personId = req.params._id
  if (!personId) {
    return res.status(400).send('Missing person identifier')
  }

  const currentPerson = await Person.findById(personId).lean().exec()
  if (!currentPerson) {
    return res.sendStatus(404)
  }

  const isSelf = me._id && personId === me._id.toString()

  const allowed = me.role.includes(Role.ADMIN) ||
                  me.role.includes(Role.SUPPORT) ||
                  isSelf

  if (!allowed) {
    return res.status(403).send('You do not have the required role to delete this person')
  }

  // VP-1297 - Anonymise user details instead of hard deleting their record
  const result = await Person.deleteOne({ _id: mongoose.Types.ObjectId(personId) })

  if (result.deletedCount === 0) {
    return res.sendStatus(400)
  }

  res.status(204)
  req.crudify = {
    result: undefined
  }
  next()
}

/**
 * Why? The Get method for api/people endpoint with a query param
 * will return an array in the db record which is fine. But the middleware job is only remove fields
 * After removing field the response return will still be in an array of 1 element which is not what the front end
 * expects. It expects the same record which is a json object only. The function bellow is used to convert array of object with 1 function
 * into an object
 */
function normalizeDBRecordObject (dbRecord) {
  if (dbRecord.length === 1) {
    return dbRecord[0]
  }
  return dbRecord
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
  p.phone = p.phone && sanitizeHtml(p.phone)
  p.about = p.about && sanitizeHtml(p.about, szAbout)
  req.body = p
  next()
}

module.exports = {
  ensureSanitized,
  listPeople,
  getPerson,
  updatePersonDetail,
  deletePerson
}
