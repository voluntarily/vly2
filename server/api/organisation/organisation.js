const mongoose = require('mongoose')
const Schema = mongoose.Schema

const organisationSchema = new Schema({
  name: { type: 'String', required: true },
  slug: { type: 'String', required: true },
  about: { type: 'String' },
  // TODO: [VP-146] make required and provide a default image in the static folder.
  imgUrl: String,
  contactEmail: String, //  TODO: replace with orgAdmin
  contactId: String,
  website: String,
  facebook: String,
  twitter: String,
  category: {
    type: [String],
    required: true,
    default: ['vp'],
    enum: ['admin', 'vp', 'op', 'ap', 'other']
  },
  dateAdded: { type: 'Date', default: Date.now, required: true }
})

module.exports = mongoose.model('Organisation', organisationSchema)
