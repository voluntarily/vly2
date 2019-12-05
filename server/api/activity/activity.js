const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const { accessibleRecordsPlugin, accessibleFieldsPlugin } = require('@casl/mongoose')

const ActivitySchema = new Schema({
  name: { type: String, required: true }, // "Growing in the garden",
  subtitle: String, // "Growing digitally in the garden",
  imgUrl: { type: String, required: true, default: '/static/img/activity/activity.png' },
  description: String, // "Project to grow something in the garden",
  duration: String, // "15 Minutes",
  offerOrg: { type: Schema.Types.ObjectId, ref: 'Organisation' },
  owner: { type: Schema.Types.ObjectId, ref: 'Person' },
  resource: {
    type: String,
    default: ''
  },
  volunteers: {
    type: String,
    default: '1'
  },
  space: {
    type: String,
    default: ''
  },
  time: {
    type: [Date]
  },
  tags: [String],
  equipment: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    required: true,
    default: 'draft',
    enum: ['draft', 'active', 'retired']
  },
  dateAdded: { type: Date, default: Date.now, required: true }
})

ActivitySchema.plugin(idvalidator)
ActivitySchema.plugin(accessibleRecordsPlugin)
ActivitySchema.plugin(accessibleFieldsPlugin)
ActivitySchema.index({ tags: 1 })

module.exports = mongoose.model('Activity', ActivitySchema)
