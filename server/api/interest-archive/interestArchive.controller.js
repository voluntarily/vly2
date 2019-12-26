const InterestArchive = require('./interestArchive')

/**
  api/interestsArchived -> list all interests
  api/interests?op='opid' -> lists all interests associated with opid
 */
const listInterests = async (req, res) => {
  const sort = 'dateAdded' // todo sort by date.
  let got
  try {
    if (req.query.op) {
      const query = { opportunity: req.query.op }
      got = await InterestArchive.find(query).populate({ path: 'person', select: 'nickname name imgUrl' }).sort(sort).exec()
    } else if (req.query.me) {
      const query = { person: req.query.me }
      got = await InterestArchive.find(query)
        .populate({ path: 'opportunity' })
        .sort(sort).exec()
    } else {
      got = await InterestArchive.find().exec()
    }
    res.json(got)
  } catch (err) {
    res.status(404).send(err)
  }
}

const updateInterest = async (req, res) => {
  try {
    await InterestArchive.updateOne({ _id: req.body._id }, { $set: { status: req.body.status } }).exec()
    res.json(req.body)
  } catch (err) {
    res.status(404).send(err)
  }
}

module.exports = {
  listInterests,
  updateInterest
}
