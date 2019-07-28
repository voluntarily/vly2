const escapeRegex = require('../../util/regexUtil')
const Opportunity = require('./opportunity')
const Interest = require('./../interest/interest')
const Tag = require('./../tag/tag')
const ArchivedOpportunity = require('./../archivedOpportunity/archivedOpportunity')
const InterestArchive = require('./../interest-archive/interestArchive')
const { OpportunityStatus } = require('./opportunity.constants')
const { regions } = require('../location/locationData')

/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */
const getOpportunities = async (req, res) => {
  let query = {} // { status: 'active' }
  let sort = 'title'
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
          { 'title': searchExpression },
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

    const personParams = {
      $and: [
        { 'status': OpportunityStatus.DRAFT }
        // { 'requestor': query.requestor }// this is incorrect: query.requestor is undefined
      ]
    }

    // console.log('requestor check: ', query)

    const publishedParams = {
      $or: [
        { 'status': OpportunityStatus.ACTIVE },
        personParams
      ]
    }

    query = {
      $and: [
        publishedParams,
        query
      ]
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

    try {
      const got = await Opportunity
        .accessibleBy(req.ability)
        .find(query)
        .select(select)
        .sort(sort)
        .exec()
      res.json(got)
    } catch (e) {
      return res.status(404).send(e)
    }
  } catch (e) {
    return res.status(500).send(e)
  }
}

const getOpportunity = async (req, res) => {
  try {
    const got = await Opportunity
      .accessibleBy(req.ability)
      .findOne(req.params)
      .populate('requestor')
      .populate('tags')
      .exec()
    if (got == null) {
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

module.exports = {
  getOpportunities,
  getOpportunity,
  putOpportunity
}
