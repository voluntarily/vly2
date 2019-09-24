const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const Badge = new Schema({
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
})

Badge.plugin(idvalidator)
module.exports = mongoose.model('Badge', Badge)
