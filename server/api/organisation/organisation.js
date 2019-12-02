const mongoose = require('mongoose')
const Schema = mongoose.Schema

const organisationSchema = new Schema({
  name: { type: 'String', required: true },
  slug: { type: 'String', required: true },
  about: { type: 'String' },
  // TODO: [VP-146] make required and provide a default image in the static folder.  imgUrl: String,
  imgUrl: { type: 'String', default: '/static/img/organisation/organisation.png' },
  website: String,
  facebook: String,
  twitter: String,
  category: {
    type: [String],
    required: true,
    default: ['vp'],
    enum: ['admin', 'vp', 'op', 'ap', 'other']
  },
  info: {
    about: String,
    instructions: String,
    followers: String,
    joiners: String,
    members: String,
    outsiders: String
  },
  dateAdded: { type: 'Date', default: Date.now, required: true },
  ageRange: {
    from: Number,
    to: Number
  },
  decile: Number,
  contactName: String,
  contactPhoneNumber: String
})

// protect multiple imports
var Organisation

if (mongoose.models.Organisation) {
  Organisation = mongoose.model('Organisation')
} else {
  Organisation = mongoose.model('Organisation', organisationSchema)
}

module.exports = Organisation
