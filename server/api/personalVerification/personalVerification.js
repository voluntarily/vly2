const mongoose = require('mongoose')
const { PersonalVerificationStatus, SchemaName } = require('./personalVerification.constants')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin
} = require('@casl/mongoose')

const VerificationStatus = {
  type: String,
  default: PersonalVerificationStatus.NOT_VERIFIED,
  required: false,
  enum: [
    PersonalVerificationStatus.NOT_VERIFIED,
    PersonalVerificationStatus.VERIFIED,
    PersonalVerificationStatus.IN_PROGRESS,
    PersonalVerificationStatus.FAILED
  ]
}
// this is deliberately similar to the Story Schema.
const VerificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: VerificationStatus,
  value: Object,
  verificationReference: String
}, {
  timestamps: true
})

const personalVerificationSchema = new Schema({
  status: VerificationStatus,
  verificationReference: String,
  person: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  voluntarilyReference: { type: String, required: true },
  captureReference: String,
  liveCaptured: String,
  liveToken: String,
  verificationObject: { type: 'object', required: false }
}, {
  timestamps: true
})
personalVerificationSchema.plugin(idvalidator)
personalVerificationSchema.plugin(accessibleFieldsPlugin)
personalVerificationSchema.plugin(accessibleRecordsPlugin)
// protect multiple imports
let PersonalVerification
if (mongoose.models.PersonalVerification) {
  PersonalVerification = mongoose.model(SchemaName)
} else {
  PersonalVerification = mongoose.model(SchemaName, personalVerificationSchema)
}

module.exports = {
  VerificationSchema,
  PersonalVerification
}
