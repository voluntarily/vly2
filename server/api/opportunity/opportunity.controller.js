const escapeRegex = require('../../util/regexUtil')
const Opportunity = require('./opportunity')
const Interest = require('./../interest/interest')
const Tag = require('./../tag/tag')
const Person = require('./../person/person')
const ArchivedOpportunity = require('./../archivedOpportunity/archivedOpportunity')
const InterestArchive = require('./../interest-archive/interestArchive')
const { OpportunityStatus } = require('./opportunity.constants')
const { regions } = require('../location/locationData')
const sanitizeHtml = require('sanitize-html')
const { getLocationRecommendations, getSkillsRecommendations } = require('./opportunity.util')

/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */
const getOpportunities = async (req, res) => {
  // limit to Active ops unless one of the params overrides
  let query = { 'status': OpportunityStatus.ACTIVE }
  let sort = 'name'
  let select = {}

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

      // case insensitive regex which will find tags matching any of the array values
      const tagSearchExpression = new RegExp(keywordArray.map(w => escapeRegex(w)).join('|'), 'i')

      // find tag ids to include in the opportunity search
      const matchingTagIds = await Tag.find({ 'tag': tagSearchExpression }, '_id').exec()

      const searchExpression = new RegExp(regexSearch, 'i')
      const searchParams = {
        $or: [
          { 'name': searchExpression },
          { 'subtitle': searchExpression },
          { 'description': searchExpression }
        ]
      }

      // mongoose isn't happy if we provide an empty array as an expression
      if (matchingTagIds.length > 0) {
        const tagIdExpression = {
          $or: matchingTagIds.map(id => ({ 'tags': id }))
        }
        searchParams.$or.push(tagIdExpression)
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
          { 'location': { $in: locsToFind } },
          query
        ]
      }
    }
    // console.log('getOpportunities', req.query, query)

    try {
      const got = await Opportunity
        .accessibleBy(req.ability)
        .find(query)
        .select(select)
        .populate('requestor', 'name nickname imgUrl')
        .populate('offerOrg', 'name imgUrl category')
        .sort(sort)
        .exec()
      res.json(got)
    } catch (e) {
      return res.status(404).send(e)
    }
  } catch (e) {
    console.log('getOpportunities error:', e)
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

const getOpportunity = async (req, res) => {
  try {
    const got = await Opportunity
      .accessibleBy(req.ability)
      .findOne(req.params)
      .populate('requestor', 'name nickname imgUrl')
      .populate('offerOrg', 'name imgUrl category')
      .populate('tags')
      .exec()
    if (got == null) {
      // BUG: [VP-478] populate tags with many tags can cause a 507 Insufficient Space error.
      // Also this error message is not helpful.  Catch and do something useful
      throw Error()
    }
    res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
}

const putOpportunity = async (req, res) => {
  try {
    if (req.body.status === OpportunityStatus.COMPLETED || req.body.status === OpportunityStatus.CANCELLED) {
      await Opportunity.findByIdAndUpdate(req.params._id, { $set: req.body })
      const archop = await archiveOpportunity(req.params._id)
      // TODO: [VP-282] after archiving return a 301 redirect to the archived opportunity
      // res.redirect(301, `/opsarchive/${archop._id}`)
      await archiveInterests(req.params._id)
      res.json(archop)
    } else {
      await Opportunity.findByIdAndUpdate(req.params._id, { $set: req.body })
      getOpportunity(req, res)
    }
  } catch (e) {
    res.status(400).send(e)
  }
}

const archiveOpportunity = async (id) => {
  let opportunity = await Opportunity.findById(id).exec()
  await new ArchivedOpportunity(opportunity.toJSON()).save()
  await Opportunity.deleteOne({ _id: id }).exec()
  return archiveOpportunity
}

const archiveInterests = async (opId) => {
  let opportunityInterests = await Interest.find({ opportunity: opId }).exec()
  let interest
  for (interest of opportunityInterests) {
    await new InterestArchive(interest.toJSON()).save()
    await Interest.deleteOne({ _id: interest._id }).exec()
  }
}

function ensureSanitized (req, res, next) {
  const descriptionOptions = {
    allowedTags: [ 'a', 'b', 'br', 'caption', 'code', 'div', 'blockquote', 'em',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'iframe', 'img', 'li', 'ol',
      'p', 'pre', 's', 'span', 'strike', 'strong', 'table', 'tbody', 'td', 'th',
      'thead', 'tr', 'u', 'ul' ],
    allowedAttributes: {
      a: [ 'href' ],
      iframe: [ 'height', 'src', 'width' ],
      img: [ 'src' ],
      pre: [ 'spellcheck' ],
      span: [ 'style' ]
    },
    allowedClasses: {
      '*': [ 'ql-align-center', 'ql-align-right', 'ql-align-justify', 'ql-syntax' ]
    },
    allowedStyles: {
      span: {
        // permits values for color and background-color CSS properties that look like 'rgb(230,0,50)'
        'color': [ /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/ ],
        'background-color': [ /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/ ]
      }
    },
    allowedIframeHostnames: [ 'www.youtube.com' ],
    // Should prevent any iframes using something other than https for their src.
    allowedSchemesByTag: { iframe: [ 'https' ] },
    allowProtocolRelative: false
  }

  const op = req.body
  if (op.name) { op.name = sanitizeHtml(op.name) }
  if (op.subtitle) { op.subtitle = sanitizeHtml(op.subtitle) }
  if (op.imgUrl) { op.imgUrl = sanitizeHtml(op.imgUrl) }
  if (op.description) { op.description = sanitizeHtml(op.description, descriptionOptions) }
  if (op.duration) { op.duration = sanitizeHtml(op.duration) }
  if (op.location) { op.location = sanitizeHtml(op.location) }
  if (op.offerOrg) { op.offerOrg = sanitizeHtml(op.offerOrg) }
  req.body = op
  next()
}

module.exports = {
  ensureSanitized,
  getOpportunities,
  getOpportunity,
  putOpportunity,
  getOpportunityRecommendations
}
