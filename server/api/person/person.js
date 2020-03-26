const mongoose = require('mongoose')
const idvalidator = require('mongoose-id-validator')
const Schema = mongoose.Schema
const { SchemaName, PersonCategory } = require('./person.constants')
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin
} = require('@casl/mongoose')
const { Role } = require('../../services/authorize/role')

// simplified version without Auth
const personSchema = new Schema({
  name: { type: 'String', required: true }, // long full name
  email: { type: 'String', index: true, unique: true, required: true }, // person@example.com
  nickname: { type: 'String', default: '' }, // how we should address you - eg. Andrew
  about: { type: 'String', default: '' }, // person description
  location: { type: 'String', default: '' },
  locations: { type: [String], default: [] },
  phone: { type: 'String' }, // +64 27 7031007
  imgUrl: { type: 'String', default: '/static/img/person/person.png' }, // url to large profile image (256x256)
  imgUrlSm: { type: 'String', default: '/static/img/person/person.png' }, // url to small profile image (24x24)
  pronoun: { type: 'Object', default: { subject: 'they', object: 'them', possessive: 'their' } },
  language: { type: 'String', default: 'EN', lowercase: true }, // en, mi, fr etc
  website: { type: 'String' },
  facebook: { type: 'String' },
  twitter: { type: 'String' },
  education: { type: 'String' },
  placeOfWork: { type: 'String' },
  job: { type: 'String' },
  sendEmailNotifications: { type: 'Boolean', default: true, required: true },
  role: {
    type: [String],
    required: true,
    default: [Role.VOLUNTEER_PROVIDER],
    enum: [
      Role.ADMIN,
      Role.ORG_ADMIN,
      Role.OPPORTUNITY_PROVIDER,
      Role.VOLUNTEER_PROVIDER,
      Role.ACTIVITY_PROVIDER,
      Role.RESOURCE_PROVIDER,
      Role.TESTER
    ]
  },
  // used to indicate whether people show up in searches.
  status: {
    type: String,
    required: true,
    default: 'active',
    enum: ['active', 'inactive', 'hold']
  },
  category: {
    type: [String],
    required: true,
    default: [],
    enum: [
      PersonCategory.VULNERABLE_PERSON,
      PersonCategory.ESSENTIAL_SERVICE
    ]
  },
  dateAdded: { type: 'Date', default: Date.now, required: true },
  tags: [String],
  // helper fields - these are only in the schema and don't need to be stored
  href: String,
  orgAdminFor: [{ type: Schema.Types.ObjectId, ref: 'Organisation' }],
  // Teacher Specific fields
  teacher: {
    registration: {
      trn: String, // teacher registration number
      firstname: String,
      lastname: String,
      category: String,
      expiry: String
    }
  }
})

personSchema.plugin(idvalidator)
personSchema.plugin(accessibleFieldsPlugin)
personSchema.plugin(accessibleRecordsPlugin)
personSchema.index({ tags: 1 })
// personSchema.plugin(accessibleFieldsPlugin)

// protect multiple imports
var Person

if (mongoose.models && mongoose.models.Person) {
  Person = mongoose.model(SchemaName)
} else {
  Person = mongoose.model(SchemaName, personSchema)
}

module.exports = Person
