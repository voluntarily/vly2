const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const { accessibleRecordsPlugin } = require('@casl/mongoose')

const feedbackSchema = new Schema(
  {
    respondent: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
    respondentOrgs: {
      type: [Schema.Types.ObjectId],
      ref: 'Organisation',
      required: true
    },
    opportunity: {
      type: Schema.Types.ObjectId,
      ref: 'ArchivedOpportunity',
      required: true
    },
    activity: { type: Schema.Types.ObjectId, ref: 'Activity', required: true },
    rating: { type: Number, min: 1, max: 5 }
  },
  { timestamps: true }
)

feedbackSchema.plugin(idvalidator)
feedbackSchema.plugin(accessibleRecordsPlugin)

// protect multiple imports
var Feedback

if (mongoose.models.Feedback) {
  Feedback = mongoose.model('Feedback')
} else {
  Feedback = mongoose.model('Feedback', feedbackSchema, 'feedback')
}

module.exports = Feedback
