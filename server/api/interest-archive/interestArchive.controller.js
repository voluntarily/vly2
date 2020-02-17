const InterestArchive = require('./interestArchive')
const { Action } = require('../../services/abilities/ability.constants')

/**
  api/interestsArchived -> list all interests
  api/interests?op='opid' -> lists all interests associated with opid
 */
const listInterests = async (req, res) => {
  const sort = 'dateAdded' // todo sort by date.

  try {
    const find = {}
    const populateList = []

    if (req.query.op) {
      find.opportunity = req.query.op
      populateList.push({ path: 'person', select: 'nickname name imgUrl' })
    }

    if (req.query.me) {
      find.person = req.query.me
      populateList.push({ path: 'opportunity' })
    }

    const query = InterestArchive.find(find)

    for (const populate of populateList) {
      query.populate(populate)
    }

    const archivedInterests = (await query
      .accessibleBy(req.ability, Action.LIST)
      .sort(sort)
      .exec())
      .filter(opportunity => opportunity.person !== null)

    res.json(archivedInterests)
  } catch (err) {
    res.status(404).send(err)
  }
}

const getInterest = async (req, res, next) => {
  try {
    const interest = await InterestArchive
      .accessibleBy(req.ability, Action.READ)
      .findOne(req.params)

    if (interest === null) {
      return res.status(404).send()
    }

    res.json(interest)
  } catch (e) {
    res.status(500).send()
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
  getInterest,
  updateInterest
}
