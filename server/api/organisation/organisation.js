import mongoose from 'mongoose'
import { accessibleRecordsPlugin } from '@casl/mongoose'
import { SchemaName, OrganisationRole } from './organisation.constants.js'

const { Schema, models, model } = mongoose
const organisationSchema = new Schema({
  name: { type: 'String', required: true, unique: true },
  slug: { type: 'String', required: true, unique: true },
  imgUrl: { type: 'String', default: '/static/img/organisation/organisation.png' },
  website: String,
  facebook: String,
  domainName: String,
  twitter: String,
  category: { // deprecated do not use
    type: [String],
    required: false,
    default: ['vp'],
    enum: ['admin', 'vp', 'op', 'ap', 'other']
    // TODO: [VP-905] replace role strings with constants in ./organisation.constants.js
  },
  role: {
    type: [String],
    required: true,
    default: [OrganisationRole.VOLUNTEER_PROVIDER],
    enum: [...Object.values(OrganisationRole)]
  },
  groups: [String], // which groups does this org belong to - business, school, individual
  info: {
    about: String,
    instructions: String,
    followers: String,
    joiners: String,
    members: String,
    outsiders: String
  },
  ageRange: {
    from: Number,
    to: Number
  },
  decile: Number,
  contactName: String,
  contactEmail: String,
  contactPhoneNumber: String,
  address: String
}, { timestamps: true })

organisationSchema.plugin(accessibleRecordsPlugin)

// protect multiple imports
// var Organisation

// if (models.Organisation) {
//   Organisation = mongoose.model(SchemaName)
// } else {
//   Organisation = mongoose.model(SchemaName, organisationSchema)
// }

// export default Organisation
export default mongoose.model(SchemaName, organisationSchema)
