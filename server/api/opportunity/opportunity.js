const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')

const opportunitySchema = new Schema({
  title: String, // "Growing in the garden",
  subtitle: String, // "Growing digitally in the garden",
  imgUrl: String, // "https://image.flaticon.com/icons/svg/206/206857.svg",
  description: String, // "Project to grow something in the garden",
  duration: String, // "15 Minutes",
  location: String, // "Newmarket, Auckland",
  status: String, // "draft",
  date: [Date],
  offerOrg: String,
  requestor: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
  tags: [
    {
      type: Schema.Types.ObjectId, ref: 'Tag'
    }
  ]
})

opportunitySchema.plugin(idvalidator)
module.exports = mongoose.model('Opportunity', opportunitySchema)
