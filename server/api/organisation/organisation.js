const mongoose = require('mongoose')
const { accessibleRecordsPlugin } = require('@casl/mongoose')
const Schema = mongoose.Schema
const { OrganisationRole } = require('./organisation.constants')
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
var Organisation

if (mongoose.models.Organisation) {
  Organisation = mongoose.model('Organisation')
} else {
  Organisation = mongoose.model('Organisation', organisationSchema)
}

module.exports = Organisation
