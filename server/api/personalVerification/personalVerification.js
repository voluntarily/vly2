const mongoose = require('mongoose')
const { PersonalVerificationStatus, SchemaName } = require('./personalVerification.constants')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin
} = require('@casl/mongoose')

const personalVerificationSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true},
  person: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  status: {
    type: 'String',
    default: PersonalVerificationStatus.NOT_VERIFIED,
    required: false,
    enum: [
      PersonalVerificationStatus.NOT_VERIFIED,
      PersonalVerificationStatus.VERIFIED
    ]
  },
  // date and time when the verification process was initiated by the user
  dateAdded: { type: 'Date', default: Date.now, required: false },
  voluntarilyReference: { type: "string", required: true},
  captureReference: { type: "string", required: false},
  liveCaptured: { type: "string", required: false},
  liveToken: { type: "string", required: false}
})
personalVerificationSchema.plugin(idvalidator)
personalVerificationSchema.plugin(accessibleFieldsPlugin)
personalVerificationSchema.plugin(accessibleRecordsPlugin)
// protect multiple imports
var PersonalVerification
if (mongoose.models.PersonalVerification) {
    PersonalVerification = mongoose.model(SchemaName)
} else {
    PersonalVerification = mongoose.model(SchemaName, personalVerificationSchema)
}

module.exports = PersonalVerification