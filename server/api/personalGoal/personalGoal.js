const mongoose = require('mongoose')
const { PersonalGoalStatus, SchemaName } = require('./personalGoal.constants')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const {
  accessibleRecordsPlugin,
  accessibleFieldsPlugin
} = require('@casl/mongoose')

const personalGoalSchema = new Schema({
  person: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  goal: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
  status: {
    type: 'String',
    default: PersonalGoalStatus.QUEUED,
    required: true,
    enum: [
      PersonalGoalStatus.NONE,
      PersonalGoalStatus.QUEUED,
      PersonalGoalStatus.ACTIVE,
      PersonalGoalStatus.COMPLETED,
      PersonalGoalStatus.HIDDEN,
      PersonalGoalStatus.CANCELLED,
      PersonalGoalStatus.CLOSED
    ]
  },
  // date when goal added to persons queue
  createdAt: { type: 'Date', default: Date.now, required: true },
  // date when they move to active status
  dateStarted: { type: 'Date', required: false },
  // date when they move to hidden status
  dateHidden: { type: 'Date', required: false },
  // date when they move to completed status
  dateCompleted: { type: 'Date', required: false }
}, { timestamps: true })

personalGoalSchema.plugin(idvalidator)
personalGoalSchema.plugin(accessibleFieldsPlugin)
personalGoalSchema.plugin(accessibleRecordsPlugin)
// protect multiple imports
var PersonalGoal
if (mongoose.models.PersonalGoal) {
  PersonalGoal = mongoose.model(SchemaName)
} else {
  PersonalGoal = mongoose.model(SchemaName, personalGoalSchema)
}
// const PersonalGoal = mongoose.model(SchemaName, personalGoalSchema)
module.exports = PersonalGoal
