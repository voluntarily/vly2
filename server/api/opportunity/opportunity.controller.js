const Opportunity = require('./opportunity')

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
    console.log('bad JSON', req.query)
    return res.status(400).send(e)
  }

  if (req.query.search) {
    const searchExpression = new RegExp(req.query.search, 'i')
    const searchParams = {
      $or: [
        { 'title': searchExpression },
        { 'subtitle': searchExpression },
        { 'description': searchExpression },
        { 'tags.tag': searchExpression }
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
  try {
    const got = await Opportunity.findOne(req.params).populate('requestor').exec()
    res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
}

module.exports = {
  getOpportunities,
  getOpportunity
}
