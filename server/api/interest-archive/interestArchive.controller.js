const InterestArchive = require('./interestArchive')
const { Action } = require('../../services/abilities/ability.constants')
const { TOPIC_INTEREST__UPDATE } = require('../../services/pubsub/topic.constants')
const Person = require('../person/person')
const { config } = require('../../../config/serverConfig')
const PubSub = require('pubsub-js')

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

const getInterestDetail = async (interestID) => {
  // Get the interest and populate out key information needed for emailing
  const interestDetail = await InterestArchive.findById(interestID)
    .populate({ path: 'person', select: 'nickname name email pronoun language sendEmailNotifications' })
    .populate({ path: 'opportunity', select: 'name requestor imgUrl date duration' })
    .exec()

  const requestorDetail = await Person.findById(interestDetail.opportunity.requestor, 'name nickname email imgUrl sendEmailNotifications')
  interestDetail.opportunity.requestor = requestorDetail
  interestDetail.opportunity.href = `${config.appUrl}/ops/${interestDetail.opportunity._id}`
  interestDetail.opportunity.imgUrl = new URL(interestDetail.opportunity.imgUrl, config.appUrl).href
  interestDetail.person.href = `${config.appUrl}/people/${interestDetail.person._id}`
  return interestDetail
}

const updateInterest = async (req, res) => {
  try {
    const interest = req.body

    const result = await InterestArchive
      .accessibleBy(req.ability, Action.UPDATE)
      .updateOne(req.params, { $set: { status: interest.status } })

    if (result.nModified === 0) {
      return res.sendStatus(404)
    }
    const interestDetail = await getInterestDetail(req.params._id)
    interestDetail.type = interest.type
    PubSub.publish(TOPIC_INTEREST__UPDATE, interestDetail)

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
