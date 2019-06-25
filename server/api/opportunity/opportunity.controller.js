const Opportunity = require('./opportunity')
const Tag = require('./../tag/tag')

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
    // console.log('bad JSON', req.query)
    return res.status(400).send(e)
  }

  if (req.query.search) {
    const { search } = req.query

    // split around one or more whitespace characters
    const keywordArray = search.trim().split(/\s+/)

    // case insensitive regex which will find tags matching any of the array values
    const tagSearchExpression = new RegExp(keywordArray.join('|'), 'i')

    // find tag ids to include in the opportunity search
    const matchingTagIds = await Tag.find({ 'tag': tagSearchExpression }, '_id').exec()

    const tagIdExpression = {
      $or: matchingTagIds.map(id => ({ 'tags': id }))
    }
    const searchExpression = new RegExp(req.query.search, 'i')
    const searchParams = {
      $or: [
        { 'title': searchExpression },
        { 'subtitle': searchExpression },
        { 'description': searchExpression },
        tagIdExpression
      ]
    }

    query = {
      $and: [
        searchParams,
        query
      ]
    }
  }

  try {
    const got = await Opportunity.find(query, select).sort(sort).exec()
    res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
}
const getOpportunity = async (req, res) => {
  // console.log('getOpportunity', req.params)
  try {
    const got = await Opportunity.findOne(req.params)
      .populate('requestor')
      .populate('tags')
      .exec()
    res.json(got)
  } catch (e) {
    // TEST: can't seem to get here. bad id handled earlier
    res.status(404).send(e)
  }
}

module.exports = {
  getOpportunities,
  getOpportunity
}
