import { findOne, accessibleBy } from './archivedOpportunity'
import { Action } from '../../services/abilities/ability.constants'
import { OpportunityListFields } from '../opportunity/opportunity.constants'

const getArchivedOpportunity = async (req, res, next) => {
  const got = await findOne(req.params)
    .populate('requestor', 'name imgUrl imgUrlSm')
    .populate('offerOrg', 'name imgUrl role')
    .exec()

  if (got === null) {
    return res.status(404)
  }

  req.crudify = { result: got }
  return next()
}

const getArchivedOpportunities = async (req, res, next) => {
  // limit to Active ops unless one of the params overrides
  let query = { }
  let sort = 'name'
  let select = OpportunityListFields.join(' ')

  try {
    query = req.query.q ? JSON.parse(req.query.q) : query
    sort = req.query.s ? JSON.parse(req.query.s) : sort
    select = req.query.p ? JSON.parse(req.query.p) : select
  } catch (e) {
    return res.status(400).send(e)
  }

  try {
    const got = await accessibleBy(req.ability, Action.LIST)
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
}

export default {
  getArchivedOpportunity,
  getArchivedOpportunities
}
