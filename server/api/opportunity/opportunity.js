const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const { accessibleRecordsPlugin, accessibleFieldsPlugin } = require('@casl/mongoose')
const { OpportunitySubject, OpportunityFields } = require('./opportunity.constants')

const opportunitySchema = new Schema({
  [OpportunityFields.TITLE]: String, // "Growing in the garden",
  [OpportunityFields.SUBTITLE]: String, // "Growing digitally in the garden",
  [OpportunityFields.IMG_URL]: String, // "https://image.flaticon.com/icons/svg/206/206857.svg",
  [OpportunityFields.DESCRIPTION]: String, // "Project to grow something in the garden",
  [OpportunityFields.DURATION]: String, // "15 Minutes",
  [OpportunityFields.LOCATION]: String, // "Newmarket, Auckland",
  [OpportunityFields.STATUS]: String, // "draft",
  [OpportunityFields.DATE]: [Date],
  [OpportunityFields.OFFER_ORG]: String,
  [OpportunityFields.REQUESTOR]: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  [OpportunityFields.DATE_ADDED]: { type: 'Date', default: Date.now, required: true },
  [OpportunityFields.TAGS]: [
    {
      type: Schema.Types.ObjectId, ref: 'Tag'
    }
  ]
})

opportunitySchema.plugin(idvalidator)
opportunitySchema.plugin(accessibleRecordsPlugin)
opportunitySchema.plugin(accessibleFieldsPlugin)

module.exports = mongoose.model(OpportunitySubject, opportunitySchema)
