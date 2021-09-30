import mongoose from 'mongoose'
import idvalidator from 'mongoose-id-validator'
import { accessibleRecordsPlugin, accessibleFieldsPlugin } from '@casl/mongoose'

import { PersonalVerificationStatus, SchemaName } from './personalVerification.constants.js'
const { Schema, models, model } = mongoose

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
export const VerificationSchema = new Schema({
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

export var PersonalVerification
if (models.PersonalVerification) {
  PersonalVerification = model(SchemaName)
} else {
  PersonalVerification = model(SchemaName, personalVerificationSchema)
}

export default {
  VerificationSchema,
  PersonalVerification
}
