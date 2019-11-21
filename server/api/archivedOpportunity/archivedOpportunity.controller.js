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

module.exports = {
  getArchivedOpportunity
}
