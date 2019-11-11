const mongoose = require('mongoose')

const tagSchema = {
  tags: [{ type: String, lowercase: true, unique: true }]
}

module.exports = mongoose.model('TagList', tagSchema)
