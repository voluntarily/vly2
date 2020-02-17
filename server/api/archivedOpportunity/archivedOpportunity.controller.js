const ArchivedOpportunity = require('./archivedOpportunity')
const { Action } = require('../../services/abilities/ability.constants')

const getArchivedOpportunity = async (req, res, next) => {
  const got = await ArchivedOpportunity
    .findOne(req.params)
    .populate('requestor')
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
  let select = 'name subtitle imgUrl status date location duration'

  try {
    query = req.query.q ? JSON.parse(req.query.q) : query
    sort = req.query.s ? JSON.parse(req.query.s) : sort
    select = req.query.p ? JSON.parse(req.query.p) : select
  } catch (e) {
    return res.status(400).send(e)
  }

  try {
    const got = await ArchivedOpportunity
      .accessibleBy(req.ability, Action.LIST)
      .find(query)
      .select(select)
      .sort(sort)
      .exec()

    req.crudify = { result: got }
    return next()
  } catch (e) {
    return res.status(404).send(e)
  }
}

module.exports = {
  getArchivedOpportunity,
  getArchivedOpportunities
}
