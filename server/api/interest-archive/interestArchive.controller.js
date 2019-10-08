const InterestArchive = require('./interestArchive')
const ArchivedOpportunity = require('../archivedOpportunity/archivedOpportunity')

/**
  api/interestsArchived -> list all interests
  api/interests?op='opid' -> lists all interests associated with opid
 */
const listInterests = async (req, res) => {
  let got
  try {
    if (req.query.op) {
      const query = { opportunity: req.query.op }
      got = await InterestArchive.find(query).populate({ path: 'person', select: 'nickname name imgUrl' }).exec()
    } else {
      got = await InterestArchive.find().exec()
    }
    res.json(got)
  } catch (err) {
    res.status(404).send(err)
  }
}

module.exports = {
  listInterests
}
