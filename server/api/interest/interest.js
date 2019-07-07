const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const { InterestSubject, InterestStatus, InterestFields } = require('./interest.constants')
const { OpportunitySubject } = require('../opportunity/opportunity.constants')

const interestSchema = new Schema({

  [InterestFields.PERSON]: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  [InterestFields.OPPORTUNITY]: { type: Schema.Types.ObjectId, ref: OpportunitySubject, required: true },
  [InterestFields.COMMENT]: String,
  [InterestFields.STATUS]: {
    type: 'String',
    required: true,
    default: InterestStatus.INTERESTED,
    enum: [
      InterestStatus.INTERESTED,
      InterestStatus.INVITED,
      InterestStatus.COMMITTED,
      InterestStatus.DECLINED,
      InterestStatus.COMPLETED,
      InterestStatus.CANCELLED
    ]
  },
  [InterestFields.DATE_ADDED]: { type: 'Date', default: Date.now, required: true }
})

/*
    State flows

    0 person clicks I'm interested, record is created
        -> interested.
    1 teacher accepts (sends invitation), holds or declines
        -> invited
        -> declined
        -> or remains in interested
    2 volunteer confirms that they will be present
        -> committed
    3 volunteer can withdraw interest (cancel)
        -> record is removed
    4 volunteer can't make the event but is still interested
        -> interested,  comment updated.
    5 teacher can withdraw the invitation
        -> declined  - if don't want the person
        -> interested - if moved back to the backlog
    6 volunteer attends the event
        -> completed
    7 teacher cancels the event
        -> cancelled

*/

interestSchema.plugin(idvalidator)
module.exports = mongoose.model(InterestSubject, interestSchema)
