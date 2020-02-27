const Interest = require('./interest')
const { InterestStatus } = require('./interest.constants')
const Person = require('../person/person')
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

const getInterestDetail = async (interestID) => {
  // Get the interest and populate out key information needed for emailing
  const interestDetail = await Interest.findById(interestID)
    .populate({ path: 'person', select: 'nickname name email pronoun language sendEmailNotifications' })
    .populate({ path: 'opportunity', select: 'name requestor imgUrl date duration' })
    .exec()

  const requestorDetail = await Person.findById(interestDetail.opportunity.requestor, 'name nickname email imgUrl sendEmailNotifications')
  interestDetail.opportunity.requestor = requestorDetail
  interestDetail.opportunity.imgUrl = `${config.appUrl}${interestDetail.opportunity.imgUrl}`
  interestDetail.opportunity.href = `${config.appUrl + '/ops/' + interestDetail.opportunity._id}`
  interestDetail.person.href = `${config.appUrl + '/people/' + interestDetail.person._id}`
  return interestDetail
}
module.exports = {
  getInterestDetail,
  personInterestCount
}
