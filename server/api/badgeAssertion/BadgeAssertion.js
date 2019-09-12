const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const BadgeAssertionSchema = new Schema({
  entityType: {
    type: String
  },
  person: {
    type: Schema.Types.ObjectId, // Person who will receive this badge
    ref: 'Person',
    required: true
  },
  image: {
    type: String,
    defualt: ''
  },
  badgeclass: {
    type: String,
    required: true
  },
  issuer: {
    type: String,
    required: true
  },
  badgeclassOpenBadgeId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date
  },
  issuedAt: {
    type: Date
  },
  issuerOpenBadgeId: {
    type: String,
    required: true
  }
})

BadgeAssertionSchema.plugin(idvalidator)
module.exports = mongoose.model('BadgeAssertion', BadgeAssertionSchema)
