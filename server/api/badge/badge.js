const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')

const SchemaName = 'Badge'
const badgeSchema = new Schema({
  entityType: {
    type: String
  },
  entityId: {
    type: String,
    required: true
  },
  person: {
    type: Schema.Types.ObjectId, // Person who will receive this badge
    ref: 'Person',
    required: true
  },
  image: {
    type: String,
    default: ''
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
  issuedOn: {
    type: Date
  },
  issuerOpenBadgeId: {
    type: String,
    required: true
  }
}, { timestamps: true })

badgeSchema.plugin(idvalidator)

// protect multiple imports
let Badge

if (mongoose.models.Badge) {
  Badge = mongoose.model(SchemaName)
} else {
  Badge = mongoose.model(SchemaName, badgeSchema)
}

module.exports = Badge
