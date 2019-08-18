const mongoose = require('mongoose')
const idvalidator = require('mongoose-id-validator')
const Schema = mongoose.Schema
const { SchemaName } = require('./person.constants')
const { accessibleRecordsPlugin, accessibleFieldsPlugin } = require('@casl/mongoose')
const { Role } = require('../../services/authorize/role')

// simplified version without Auth
const personSchema = new Schema({
  name: { type: 'String', required: true }, // long full name
  email: { type: 'String', index: true, unique: true, required: true }, // person@example.com
  nickname: { type: 'String', default: '' }, // how we should address you - eg. Andrew
  about: { type: 'String', default: '' }, // person description
  location: { type: 'String', default: '' },
  phone: { type: 'String', required: false }, // +64 27 7031007
  gender: { type: 'String', default: '' }, // whatever they want to write.
  language: { type: String, default: 'EN', lowercase: true }, // en, mi, fr etc
  avatar: String, // url to image
  role: {
    type: [String],
    required: true,
    default: [Role.VOLUNTEER_PROVIDER],
    enum: [Role.ADMIN, Role.ORG_ADMIN, Role.OPPORTUNITY_PROVIDER, Role.VOLUNTEER_PROVIDER, Role.ACTIVITY_PROVIDER, Role.RESOURCE_PROVIDER, Role.TESTER]
  },
  // used to indicate whether people show up in searches.
  status: {
    type: 'String',
    required: true,
    default: 'active',
    enum: ['active', 'inactive', 'hold']
  },
  dateAdded: { type: 'Date', default: Date.now, required: true },
  tags: [
    {
      type: Schema.Types.ObjectId, ref: 'Tag'
    }
  ]
})

personSchema.plugin(idvalidator)
personSchema.plugin(accessibleFieldsPlugin)
personSchema.plugin(accessibleRecordsPlugin)
// personSchema.plugin(accessibleFieldsPlugin)

module.exports = mongoose.model(SchemaName, personSchema)
