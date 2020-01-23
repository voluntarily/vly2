const ArchivedOpportunity = require('./archivedOpportunity')

const getArchivedOpportunity = async (req, res) => {
  try {
    const got = await ArchivedOpportunity
      .findOne(req.params)
      .populate('requestor')
      .exec()
    if (got == null) {
      throw Error()
    }
    return res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
}
const getArchivedOpportunities = async (req, res) => {
  // limit to Active ops unless one of the params overrides
  let query = { }
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
    const got = await ArchivedOpportunity
      .find(query)
      .select(select)
      .sort(sort)
      .exec()
    res.json(got)
  } catch (e) {
    return res.status(404).send(e)
  }
}

module.exports = {
  getArchivedOpportunity,
  getArchivedOpportunities
}
