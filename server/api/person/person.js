const mongoose = require('mongoose')
const idvalidator = require('mongoose-id-validator')
const Schema = mongoose.Schema
const { SchemaName, PersonStatus } = require('./person.constants')
const { VerificationSchema } = require('../personalVerification/personalVerification')
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin
} = require('@casl/mongoose')
const { Role } = require('../../services/authorize/role')

// simplified version without Auth
const personSchema = new Schema({
  // Public information
  nickname: { type: 'String', default: '' }, // how we should address you - eg. Andrew
  email: { type: 'String', index: true, unique: true, required: true }, // person@example.com
  name: { type: 'String', required: true }, // long full name
  about: { type: 'String', default: '' }, // person description
  imgUrl: { type: 'String', default: '/static/img/person/person.png' }, // url to large profile image (256x256)
  imgUrlSm: { type: 'String', default: '/static/img/person/person.png' }, // url to small profile image (24x24)
  pronoun: { type: 'Object', default: { subject: 'they', object: 'them', possessive: 'their' } },
  language: { type: 'String', default: 'EN', lowercase: true }, // en, mi, fr etc
  tags: [String], // skills Tag list e.g. ['physics', 'chemistry', 'robots']
  topicGroups: [String], // org/topic group tags e.g. ['business', 'community', 'schools' ]

  // Personal Private Information
  phone: { type: 'String' }, // +64 27 7031007
  dob: Date,
  location: { type: 'String', default: '' }, // deprecated use locations
  locations: { type: [String], default: [] },
  address: {
    street: { type: 'String' },
    suburb: { type: 'String' },
    city: { type: 'String' },
    postcode: { type: 'String' },
    region: { type: 'String' },
    addressSummary: { type: 'String' }
  },

  // Social Information
  website: { type: 'String' },
  facebook: { type: 'String' },
  twitter: { type: 'String' },

  // Demographic Information
  education: { type: 'String' },
  placeOfWork: { type: 'String' },
  job: { type: 'String' },

  // System Status and Flags
  sendEmailNotifications: { type: 'Boolean', default: true, required: true },

  role: {
    type: [String],
    default: [Role.BASIC],
    enum: [...Object.values(Role)]
  },

  // verification level and supporting recommendations
  verified: [VerificationSchema],

  // used to indicate whether people show up in searches.
  status: {
    type: String,
    required: true,
    default: 'active',
    enum: [...Object.values(PersonStatus)]
  },
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
}, { timestamps: true })

personSchema.plugin(idvalidator)
personSchema.plugin(accessibleFieldsPlugin)
personSchema.plugin(accessibleRecordsPlugin)
personSchema.index({ tags: 1 })
// personSchema.plugin(accessibleFieldsPlugin)

// protect multiple imports
let Person

if (mongoose.models && mongoose.models.Person) {
  Person = mongoose.model(SchemaName)
} else {
  Person = mongoose.model(SchemaName, personSchema)
}

module.exports = Person
