const mongoose = require('mongoose')
const { accessibleRecordsPlugin } = require('@casl/mongoose')
const Schema = mongoose.Schema

const organisationSchema = new Schema({
  name: { type: 'String', required: true, unique: true },
  slug: { type: 'String', required: true, unique: true },
  about: { type: 'String' }, // deprecated don't use
  // TODO: [VP-146] make required and provide a default image in the static folder.  imgUrl: String,
  imgUrl: { type: 'String', default: '/static/img/organisation/organisation.png' },
  website: String,
  facebook: String,
  domainName: String,
  twitter: String,
  category: {
    type: [String],
    required: true,
    default: ['vp'],
    enum: ['admin', 'vp', 'op', 'ap', 'other']
    // TODO: [VP-905] replace category strings with constants in ./organisation.constants.js
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
