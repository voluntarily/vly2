const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const { accessibleRecordsPlugin, accessibleFieldsPlugin } = require('@casl/mongoose')
const { OpportunityStatus, OpportunityType } = require('./opportunity.constants')
const { SchemaName } = require('./opportunity.constants')

const opportunityAddressSchema = new Schema({
  street: String,
  suburb: String,
  city: String,
  postcode: String,
  region: String
})

const opportunitySchema = new Schema({
  type: {
    type: String,
    required: true,
    default: OpportunityType.ASK,
    enum: [
      OpportunityType.ASK,
      OpportunityType.OFFER
    ]
  },
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
  name: String, // "Growing in the garden",
  title: String, // deprecated - use name instead
  subtitle: String, // "Growing digitally in the garden",
  imgUrl: { type: 'String', required: false, default: '/static/img/opportunity/opportunity.png' }, // "https://image.flaticon.com/icons/svg/206/206857.svg",
  description: String, // "Project to grow something in the garden",
  duration: String, // "15 Minutes",
  location: String, // region or city,  deprecated - use locations array
  locations: { type: [String], default: [] }, // list of places where Op is of interest region or city,
  address: opportunityAddressSchema,
  venue: String, // actual address
  date: [Date], // start and optional end dates
  fromActivity: { type: Schema.Types.ObjectId, ref: 'Activity', required: false },
  offerOrg: { type: Schema.Types.ObjectId, ref: 'Organisation', required: false },
  requestor: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  href: String,
  tags: { type: [String], required: true, default: [] }
}, { timestamps: true })

opportunitySchema.plugin(idvalidator)
opportunitySchema.plugin(accessibleRecordsPlugin)
opportunitySchema.plugin(accessibleFieldsPlugin)
opportunitySchema.index({ tags: 1 })

// protect multiple imports
var Opportunity

if (mongoose.models.Opportunity) {
  Opportunity = mongoose.model(SchemaName)
} else {
  Opportunity = mongoose.model(SchemaName, opportunitySchema)
}

module.exports = Opportunity
