const mongoose = require('mongoose')
const { SchemaName, DefaultTagList } = require('./tag.constants')

const tagSchema = {
  name: { type: String, lowercase: true, unique: true, required: true, default: DefaultTagList },
  tags: [
    { type: String, lowercase: true }
  ]
}

module.exports = mongoose.model(SchemaName, tagSchema)
