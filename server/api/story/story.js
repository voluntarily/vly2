const mongoose = require('mongoose')
const Schema = mongoose.Schema
const idvalidator = require('mongoose-id-validator')
const { accessibleRecordsPlugin } = require('@casl/mongoose')
const { SchemaName } = require('./story.constants')

// simplified version without Auth
const storySchema = new Schema({
  name: { type: 'String' }, // title of story
  body: { type: 'String', default: '' }, // story content
  imgUrl: { type: 'String' }, // url to image
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  status: {
    type: String,
    required: true,
    default: 'draft',
    enum: ['draft', 'published', 'deleted']
  },
  datePublished: { type: 'Date' },
  allowComments: { type: Boolean, default: true, required: true },
  parent: { type: Schema.Types.ObjectId },
  tags: [String],
  albumKey: [String]
}, { timestamps: true })

storySchema.plugin(idvalidator)
storySchema.plugin(accessibleRecordsPlugin)
storySchema.index({ tags: 1 })

// protect multiple imports
var Story

if (mongoose.models.Story) {
  Story = mongoose.model(SchemaName)
} else {
  Story = mongoose.model(SchemaName, storySchema)
}

module.exports = Story
