const Interest = require('./interest')
const { InterestStatus } = require('./interest.constants')
const { config } = require('../../../config/serverConfig')

const personInterestCount = (personId) => {
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

const personFields = 'name nickname email imgUrl pronoun sendEmailNotifications'
const getInterestDetail = async (interestID) => {
  // Get the interest and populate out key information needed for emailing
  const interestDetail = await Interest.findById(interestID)
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

module.exports = {
  getInterestDetail,
  personInterestCount
}
