const escapeRegex = require('../../util/regexUtil')
const Opportunity = require('./opportunity')
const Tag = require('./../tag/tag')
const OpportunityArchive = require('./../opportunity-archive/opportunityArchive')

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

  if (req.query.search) {
    try {
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
    } catch (e) {
      // something went wrong constructing the query but we don't know what
      return res.status(500).send(e)
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
}

const getOpportunity = async (req, res) => {
  try {
    const got = await Opportunity
      .accessibleBy(req.ability)
      .findOne(req.params)
      .populate('requestor')
      .populate('tags')
      .exec()
    res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
}

const putOpportunity = async (req, res) => {
  try {
    if (req.body.status === 'done' || req.body.status === 'cancelled') {
      await Opportunity.findByIdAndUpdate(req.params._id, { $set: req.body })
      await archiveOpportunity(req.params._id)
    } else {
      await Opportunity.findByIdAndUpdate(req.params._id, { $set: req.body })
    }
    res.json(req.body)
  } catch (e) {
    res.status(400).send(e)
  }
}

const archiveOpportunity = async (id) => {
  let opportunity = await Opportunity.findById(id).exec()
  let opObject = opportunity.toJSON()
  const opportunityArchive = new OpportunityArchive(opObject)
  await opportunityArchive.save()
  await Opportunity.findByIdAndDelete(id).exec()
  return archiveOpportunity
}

module.exports = {
  getOpportunities,
  getOpportunity,
  putOpportunity
}
