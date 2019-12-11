const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { SCHOOL_TYPES } = require('./school-lookup.constants')

const schoolLookUpSchema = new Schema({
  schoolId: { type: Number, required: true },
  name: { type: String },
  telephone: { type: String },
  emailDomain: { type: String, required: true },
  contactName: { type: String },
  website: String,
  address: String,
  schoolType: {
    type: String,
    enum: Object.values(SCHOOL_TYPES),
    required: true
  },
  decile: Number
})

module.exports = mongoose.model('SchoolLookUp', schoolLookUpSchema)
