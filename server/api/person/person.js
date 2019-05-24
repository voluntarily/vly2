const mongoose = require('mongoose')
const Schema = mongoose.Schema

// simplified version without Auth
const personSchema = new Schema({
  name: { type: 'String', required: true }, // long full name
  email: { type: 'String', index: true, unique: true, required: true }, // person@example.com
  nickname: { type: 'String', default: '' }, // how we should address you - eg. Andrew
  about: { type: 'String', default: '' }, // person description
  phone: { type: 'String', required: true }, // +64 27 7031007
  gender: { type: 'String', default: '' }, // whatever they want to write.
  password: { type: 'String' }, // encoded
  language: { type: String, default: 'EN', lowercase: true }, // en, mi, fr etc
  avatar: String, // url to image
  role: {
    type: [String],
    required: true,
    default: ['volunteer'],
    enum: ['admin', 'op-provider', 'volunteer', 'content-provider', 'tester']
  },
  // used to indicate whether people show up in searches.
  status: {
    type: 'String',
    required: true,
    default: 'active',
    enum: ['active', 'inactive', 'hold']
  },
  dateAdded: { type: 'Date', default: Date.now, required: true }
})

module.exports = mongoose.model('Person', personSchema)
