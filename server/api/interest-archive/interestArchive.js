const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Interest = require('../interest/interest')

const interestArchiveSchema = new Schema({
  ...Interest.schema.obj,
  opportunity: { type: Schema.Types.ObjectId, ref: 'OpportunityArchive', required: true }
})

module.exports = mongoose.model('InterestArchive', interestArchiveSchema)
