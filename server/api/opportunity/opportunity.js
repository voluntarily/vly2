const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const { accessibleRecordsPlugin, accessibleFieldsPlugin } = require('@casl/mongoose')
const { OpportunityStatus } = require('./opportunity.constants')
const { SchemaName } = require('./opportunity.constants')

const opportunitySchema = new Schema({
  name: String, // "Growing in the garden",
  title: String, // deprecated - use name instead
  subtitle: String, // "Growing digitally in the garden",
  imgUrl: String, // "https://image.flaticon.com/icons/svg/206/206857.svg",
  description: String, // "Project to grow something in the garden",
  duration: String, // "15 Minutes",
  location: String, // "Newmarket, Auckland",
  status: {
    type: String,
    required: true,
    default: OpportunityStatus.DRAFT,
    enum: [
      OpportunityStatus.DRAFT,
      OpportunityStatus.ACTIVE,
      OpportunityStatus.COMPLETED,
      OpportunityStatus.CANCELLED
    ]
  },
  date: [Date],
  fromActivity: { type: Schema.Types.ObjectId, ref: 'Activity', required: false },
  offerOrg: { type: Schema.Types.ObjectId, ref: 'Organisation', required: false },
  requestor: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
  tags: [
    {
      type: Schema.Types.ObjectId, ref: 'Tag'
    }
  ]
})

opportunitySchema.plugin(idvalidator)
opportunitySchema.plugin(accessibleRecordsPlugin)
opportunitySchema.plugin(accessibleFieldsPlugin)

module.exports = mongoose.model(SchemaName, opportunitySchema)
