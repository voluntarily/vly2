import { InterestStatus } from '../interest.constants'
const interests = [
  {
    status: InterestStatus.INVITED,
    comment: 'Invitation 1'
  },
  {
    status: InterestStatus.COMMITTED,
    comment: 'Invitation 2'
  },
  {
    status: InterestStatus.ATTENDED,
    comment: 'Invitation 3'
  },
  {
    status: InterestStatus.ATTENDED,
    comment: 'invitation 4'
  }
]

module.exports = interests
