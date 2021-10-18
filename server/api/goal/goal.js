const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')

const goalSchema = new Schema({
  //   name - a short name that indicates what needs to be done - these use verbs and active voice.
  //   e.g  Complete your profile,
  //        Get Police Vetted
  //        Attend your first event
  //        Complete your safety training
  name: { type: 'String', required: true },

  // slug - language-independent identifier.
  slug: { type: 'String', required: true },

  // subtitle - a sentence that describes the purpose of the goal
  subtitle: { type: 'String' },

  // badgeclass - the class of the badge that will be issued on completion
  badgeclass: { type: 'String' },

  // imgUrl - a picture that illustrates the goal
  imgUrl: { type: 'String', default: '/static/img/goal/goal.png' },

  // description - one or two paragraphs about why you need to do this, what steps are involved and what the outcomes will be.
  description: { type: 'String' },

  // preconditions - badges that you have to have in order to start this goal.
  preconditions: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],

  // startLink - entry point into the interactive workflow
  startLink: { type: 'String' },

  // language code - which language the goal and workflow is in.
  language: { type: 'String', default: 'en' },

  // Role - 'Getting Started', 'Prepare for volunteering'
  group: { type: 'String' },

  // evaluation - function that checks whether the goal has been completed - e.g. badge presents, status value etc.
  evaluation: { type: 'String', required: true, default: '() => false' },
  rank: { type: 'Number', default: 99, required: true }
},
{
  timestamps: true
})
goalSchema.plugin(idvalidator)

// protect multiple imports
let Goal
if (mongoose.models.Goal) {
  Goal = mongoose.model('Goal')
} else {
  Goal = mongoose.model('Goal', goalSchema)
}
// const Goal = mongoose.model('Goal', goalSchema)

module.exports = Goal
