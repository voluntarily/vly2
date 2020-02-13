const mongoose = require('mongoose')
const { SchemaName } = require('./tag.constants')

const tagSchema = {
  tags: [
    { type: String, lowercase: true, unique: true }
  ]
}

module.exports = mongoose.model(SchemaName, tagSchema)
