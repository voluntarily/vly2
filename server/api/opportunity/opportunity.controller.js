const { Action } = require('../../services/abilities/ability.constants')
const escapeRegex = require('../../util/regexUtil')
const Opportunity = require('./opportunity')
const { Interest, InterestArchive } = require('./../interest/interest')
const Person = require('./../person/person')
const ArchivedOpportunity = require('./../archivedOpportunity/archivedOpportunity')
const { OpportunityStatus, OpportunityListFields } = require('./opportunity.constants')
const { ActivityOpFields } = require('../activity/activity.constants')
const { regions } = require('../location/locationData')
const sanitizeHtml = require('sanitize-html')
const { getLocationRecommendations, getSkillsRecommendations } = require('./opportunity.util')
const { Role } = require('../../services/authorize/role')
const Member = require('../member/member')

/**
 * Get all ops
 * @param req
 * @param res
 * @returns void
 */
const listOpportunities = async (req, res, next) => {
  // Default to Active ops unless one of the params overrides
  let query = { status: OpportunityStatus.ACTIVE }
  let sort = 'name'
  // return only the summary needed for an OpCard
  let select = OpportunityListFields.join(' ')

  try {
    query = req.query.q ? JSON.parse(req.query.q) : query
    sort = req.query.s ? JSON.parse(req.query.s) : sort
    select = req.query.p ? JSON.parse(req.query.p) : select
  } catch (e) {
    return res.status(400).send(e)
  }

  try {
    if (req.query.search) {
      const search = req.query.search.trim()
      const regexSearch = escapeRegex(search)

      // split around one or more whitespace characters
      const keywordArray = search.split(/\s+/)

      const searchExpression = new RegExp(regexSearch, 'i')

      const searchParams = {
        $or: [
          { name: searchExpression },
          { subtitle: searchExpression },
          { description: searchExpression },
          { tags: { $in: keywordArray } }
        ]
      }

      query = {
        $and: [
          searchParams,
          query
        ]
      }
    }

    const locFilter = req.query.location
    if (locFilter) {
      const region = regions.find(r => r.name === locFilter)
      const locsToFind = region ? [locFilter, ...region.containedTerritories] : [locFilter]

      // location is a filter so should still match all other queries. use AND, not OR
      query = {
        $and: [
          { location: { $in: locsToFind } },
          query
        ]
      }
    }
    try {
      const got = await Opportunity
        .accessibleBy(req.ability)
        .find(query)
        .select(select)
        .populate('requestor', 'name nickname imgUrl')
        .populate('offerOrg', 'name imgUrl role')
        .sort(sort)
        .exec()

      req.crudify = { result: got }
      return next()
    } catch (e) {
      return res.status(404).send(e)
    }
  } catch (e) {
    console.error('listOpportunities error:', e)
    return res.status(500).send(e)
  }
}

const getOpportunityRecommendations = async (req, res) => {
  const meId = req.query.me
  if (!meId) {
    return res.status(400).send('Must include "me" parameter')
  }

  try {
    const me = await Person.findById(meId)
    if (!me) {
      return res.status(400).send('Could not find the specified user')
    }

    const locationOps = await getLocationRecommendations(me)
    const skillsOps = await getSkillsRecommendations(me)

    return res.json({ basedOnLocation: locationOps, basedOnSkills: skillsOps })
  } catch (e) {
    return res.status(500).send(e)
  }
}

const getOpportunity = async (req, res, next) => {
  try {
    const got = await Opportunity
      .accessibleBy(req.ability, Action.READ)
      .findOne(req.params)
      .populate('requestor', 'name nickname imgUrl')
      .populate('offerOrg', 'name imgUrl role')
      .populate('fromActivity', ActivityOpFields.join(' '))
      .exec()
    if (got == null) {
      // BUG: [VP-478] populate tags with many tags can cause a 507 Insufficient Space error.
      // Also this error message is not helpful.  Catch and do something useful
      throw Error()
    }
    req.crudify = { result: got }
    return next()
  } catch (e) {
    res.status(404).send(e)
  }
}

const putOpportunity = async (req, res, next) => {
  const me = req.session && req.session.me
  if (!me) {
    return res.sendStatus(401)
  }

  try {
    if (!me.role.includes(Role.ADMIN)) {
      // Once an opportunity has been created we should not be able to change the activity it was based on
      if (req.body.fromActivity) {
        return res.status(400).send('Cannot change the fromActivity field')
      }

      if (req.body.offerOrg && (await Member.find({ person: me._id, organisation: req.body.offerOrg })).length === 0) {
        return res.status(400).send('Invalid organisation')
      }
    }

    if (req.body.status === OpportunityStatus.COMPLETED || req.body.status === OpportunityStatus.CANCELLED) {
      await Opportunity
        .accessibleBy(req.ability, Action.UPDATE)
        .updateOne({ _id: req.params._id }, req.body)

      const archOp = await archiveOpportunity(req.params._id)
      await archiveInterests(req.params._id)
      req.crudify = { result: archOp }
      return next()
    } else {
      const result = await Opportunity
        .accessibleBy(req.ability, Action.UPDATE)
        .updateOne({ _id: req.params._id }, { $set: req.body })
      if (result.n === 0) {
        return res.sendStatus(404)
      }

      await getOpportunity(req, res, next)
    }
  } catch (e) {
    console.error(e)
    res.status(400).send(e)
  }
}

const deleteOpportunity = async (req, res, next) => {
  try {
    const result = await Opportunity
      .accessibleBy(req.ability, Action.DELETE)
      .deleteOne({ _id: req.params._id })

    if (result.nDeleted === 0) {
      return res.sendStatus(404)
    }
  } catch (e) {
    return res.sendStatus(500)
  }

  req.crudify = { result: {} }
  res.status(204)
  next()
}

const createOpportunity = async (req, res, next) => {
  const me = req && req.session && req.session.me
  if (!me) {
    return res.sendStatus(401)
  }

  const canCreate = async () => {
    if (me.role.includes(Role.ADMIN)) {
      return true
    }
    if (me.role.includes(Role.ORG_ADMIN) && req.body.offerOrg && me.orgAdminFor.includes(req.body.offerOrg)) {
      return true
    }
    if (me.role.includes(Role.OPPORTUNITY_PROVIDER) || me.role.includes(Role.VOLUNTEER)) {
      if (!req.body.offerOrg) {
        return false
      }

      // The offerOrg must be one the current user is a member of
      return (await Member.find({ person: me._id, organisation: req.body.offerOrg })).length > 0
    }

    return false
  }

  if (!(await canCreate())) {
    return res.status(403).send('Must have create permission')
  }

  try {
    const result = await Opportunity.create(req.body)

    req.crudify = { result }
    res.status(200)
    next()
  } catch (e) {
    res.sendStatus(500)
  }
}

const archiveOpportunity = async (id) => {
  const opportunity = await Opportunity.findById(id).exec()
  await new ArchivedOpportunity(opportunity.toJSON()).save()
  await Opportunity.deleteOne({ _id: id }).exec()
  return archiveOpportunity
}

const archiveInterests = async (opId) => {
  const opportunityInterests = await Interest.find({ opportunity: opId }).exec()
  let interest
  for (interest of opportunityInterests) {
    await new InterestArchive(interest.toJSON()).save()
    await Interest.deleteOne({ _id: interest._id }).exec()
  }
}

function ensureSanitized (req, res, next) {
  const descriptionOptions = {
    allowedTags: ['a', 'b', 'br', 'caption', 'code', 'div', 'blockquote', 'em',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'iframe', 'img', 'li', 'ol',
      'p', 'pre', 's', 'span', 'strike', 'strong', 'table', 'tbody', 'td', 'th',
      'thead', 'tr', 'u', 'ul'],
    allowedAttributes: {
      a: ['href'],
      iframe: ['height', 'src', 'width'],
      img: ['src'],
      pre: ['spellcheck'],
      span: ['style']
    },
    allowedClasses: {
      '*': ['ql-align-center', 'ql-align-right', 'ql-align-justify', 'ql-syntax']
    },
    allowedStyles: {
      span: {
        color: [/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
        backgroundColor: [/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/]
      }
    },
    allowedIframeHostnames: ['www.youtube.com'],
    allowedSchemesByTag: { iframe: ['https'] },
    allowProtocolRelative: false
  }

  const op = req.body
  if (op.description) { op.description = sanitizeHtml(op.description, descriptionOptions) }
  req.body = op
  next()
}

module.exports = {
  ensureSanitized,
  listOpportunities,
  getOpportunity,
  putOpportunity,
  deleteOpportunity,
  getOpportunityRecommendations,
  createOpportunity
}
