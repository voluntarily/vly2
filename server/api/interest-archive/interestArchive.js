const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Interest = require('../interest/interest')

const InterestStatus = {
  INTERESTED: 'interested',
  INVITED: 'invited',
  COMMITTED: 'committed',
  DECLINED: 'declined',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ATTENDED: 'attended',
  NOTATTENDED: 'not attended'
}

const interestArchiveSchema = new Schema({
  ...Interest.schema.obj,
  opportunity: { type: Schema.Types.ObjectId, ref: 'ArchivedOpportunity', required: true },
  status: {
    type: 'String',
    required: true,
    enum: [
      InterestStatus.INTERESTED,
      InterestStatus.INVITED,
      InterestStatus.COMMITTED,
      InterestStatus.DECLINED,
      InterestStatus.ATTENDED,
      InterestStatus.NOTATTENDED
    ]
  }
})

module.exports = mongoose.model('InterestArchive', interestArchiveSchema)
