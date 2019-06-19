const Opportunity = require('./opportunity')
const { Action } = require('../../services/abilities/ability.constants')

/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */
const getOpportunities = async (req, res) => {
  let query = {} // { status: 'active' }
  let sort = 'title'

  try {
    query = req.query.q ? JSON.parse(req.query.q) : query
    sort = req.query.s ? JSON.parse(req.query.s) : sort
  } catch (e) {
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
    const accessibleFields = Opportunity.accessibleFieldsBy(req.ability, Action.LIST).join(' ')
    const got = await Opportunity.accessibleBy(req.ability, Action.LIST).find(query).select(accessibleFields).sort(sort).exec()
    res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
}
const getOpportunity = async (req, res) => {
  try {
    const accessibleFields = Opportunity.accessibleFieldsBy(req.ability, Action.LIST).join(' ')
    const got = await Opportunity.accessibleBy(req.ability).findOne(req.params).select(accessibleFields).populate('requestor').exec()
    res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
}

module.exports = {
  getOpportunities,
  getOpportunity
}
