const mongoose = require('mongoose')
const Schema = mongoose.Schema

const organisationSchema = new Schema({
  name: { type: 'String', required: true },
  slug: { type: 'String', required: true },
  about: { type: 'String', required: true },
  imgUrl: String,
  contactEmail: String,
  contactId: String,
  website: String,
  type: {
    type: [String],
    required: true,
    default: ['vp'],
    enum: ['admin', 'vp', 'op', 'ap', 'other']
  },
  dateAdded: { type: 'Date', default: Date.now, required: true }
})

module.exports = mongoose.model('Organisation', organisationSchema)
