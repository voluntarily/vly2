const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const { accessibleRecordsPlugin } = require('@casl/mongoose')
const { InterestStatus, InterestSchemaName, InterestArchiveSchemaName } = require('./interest.constants')

// this is deliberately similar to the Story Schema.
const messageSchema = new mongoose.Schema({
  body: String,
  // who sent the message (op or vp?)
  author: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  createdAt: { type: Date, default: Date.now, required: true }
})

const interestSchema = new Schema({
  person: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  opportunity: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  comment: String, // deprecated in favour of messages
  messages: [messageSchema],
  status: {
    type: String,
    required: true,
    default: InterestStatus.INTERESTED,
    enum: [
      InterestStatus.INTERESTED,
      InterestStatus.INVITED,
      InterestStatus.COMMITTED,
      InterestStatus.DECLINED
    ]
  },
  termsAccepted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, required: true }
})

const interestArchiveSchema = new Schema({
  ...interestSchema.obj,
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
}, { timestamps: true })

interestSchema.plugin(idvalidator)
interestSchema.plugin(accessibleRecordsPlugin)
interestArchiveSchema.plugin(idvalidator)
interestArchiveSchema.plugin(accessibleRecordsPlugin)

// protect multiple imports
let Interest
let InterestArchive

if (mongoose.models.Interest) {
  Interest = mongoose.model(InterestSchemaName)
  InterestArchive = mongoose.model(InterestArchiveSchemaName)
} else {
  Interest = mongoose.model(InterestSchemaName, interestSchema)
  InterestArchive = mongoose.model(InterestArchiveSchemaName, interestArchiveSchema)
}
module.exports = {
  Interest,
  InterestArchive,
  InterestSchemaName,
  InterestArchiveSchemaName
}

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
