const mongoose = require('mongoose')
const idvalidator = require('mongoose-id-validator')
const Schema = mongoose.Schema
const SchemaName = 'Story'

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
    enum: ['draft', 'published', 'cancelled']
  },
  dateAdded: { type: 'Date', default: Date.now, required: true },
  datePublished: { type: 'Date' },
  allowComments: { type: Boolean, default: true, required: true },
  parent: { type: Schema.Types.ObjectId },
  tags: [String]
})

storySchema.plugin(idvalidator)
storySchema.index({ tags: 1 })

// protect multiple imports
var Story

if (mongoose.models.Story) {
  Story = mongoose.model(SchemaName)
} else {
  Story = mongoose.model(SchemaName, storySchema)
}

module.exports = Story
