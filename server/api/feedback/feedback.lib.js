const { InterestArchive } = require('../interest/interest')
const { InterestStatus } = require('../interest/interest.constants')

const verifyAttendance = async ({ respondent, opportunity }) => {
  return InterestArchive.exists({ person: respondent, opportunity, status: InterestStatus.ATTENDED })
}

module.exports = {
  verifyAttendance
}
