const { Interest, InterestArchive } = require('./interest')
const { InterestStatus } = require('./interest.constants')
const { config } = require('../../../config/serverConfig')

const personInterestCountA = InterestSchema => (personId) => {
  const query = {
    person: personId,
    status: {
      $in: [
        InterestStatus.INTERESTED,
        InterestStatus.INVITED,
        InterestStatus.COMMITTED
      ]
    }
  }
  return Interest.countDocuments(query).exec()
}
const personInterestCount = personInterestCountA(Interest)
const personInterestArchiveCount = personInterestCountA(InterestArchive)

const personFields = 'name nickname email role imgUrl pronoun sendEmailNotifications'

const getInterestDetailA = InterestSchema => async (interestID) => {
  // Get the interest and populate out key information needed for emailing
  const interestDetail = await InterestSchema.findById(interestID)
    .populate({ path: 'person', select: personFields })
    .populate({
      path: 'opportunity',
      select: 'name imgUrl date duration',
      populate: { path: 'requestor', select: personFields }
    })
    .populate({ path: 'messages.author', select: 'nickname imgUrl' }) // just enough to label the message
    .exec()

  interestDetail.opportunity.imgUrl = new URL(interestDetail.opportunity.imgUrl, config.appUrl).href
  interestDetail.opportunity.href = `${config.appUrl + '/ops/' + interestDetail.opportunity._id}`
  interestDetail.person.href = `${config.appUrl + '/people/' + interestDetail.person._id}`
  return interestDetail
}
const getInterestDetail = getInterestDetailA(Interest)
const getInterestArchiveDetail = getInterestDetailA(InterestArchive)

const getMyOpInterestDetailA = InterestSchema => async (opportunity, person) => {
  // Get the interest and populate out key information needed for emailing
  const interestDetail = await InterestSchema.findOne({ opportunity, person })
    .populate({ path: 'person', select: personFields })
    .populate({
      path: 'opportunity',
      select: 'name imgUrl date duration',
      populate: { path: 'requestor', select: personFields }
    })
    .populate({ path: 'messages.author', select: 'nickname imgUrl' }) // just enough to label the message
    .exec()
  interestDetail.opportunity.imgUrl = new URL(interestDetail.opportunity.imgUrl, config.appUrl).href
  interestDetail.opportunity.href = `${config.appUrl + '/ops/' + interestDetail.opportunity._id}`
  interestDetail.person.href = `${config.appUrl + '/people/' + interestDetail.person._id}`
  return interestDetail
}

const getMyOpInterestDetail = getMyOpInterestDetailA(Interest)
const getMyOpInterestArchiveDetail = getMyOpInterestDetailA(InterestArchive)

module.exports = {
  getInterestDetailA,
  getMyOpInterestDetailA,
  personInterestCountA,

  getInterestDetail,
  getMyOpInterestDetail,
  personInterestCount,

  getMyOpInterestArchiveDetail,
  getInterestArchiveDetail,
  personInterestArchiveCount
}
