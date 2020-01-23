const Interest = require('./interest')
const { InterestStatus } = require('./interest.constants')

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

module.exports = {
  personInterestCount
}
