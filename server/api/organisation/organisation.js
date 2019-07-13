const mongoose = require('mongoose')
const Schema = mongoose.Schema

const organisationSchema = new Schema({
  name: { type: 'String', required: true },
  slug: { type: 'String', required: true },
<<<<<<< Updated upstream
  about: { type: 'String' },
  // TODO: [VP-146] make required and provide a default image in the static folder.
  imgUrl: String,
=======
  about: { type: 'String', required: true },
  imgUrl: { type: 'String', required: true, default: '../../../static/img/organisation/organisation.png' },
>>>>>>> Stashed changes
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
